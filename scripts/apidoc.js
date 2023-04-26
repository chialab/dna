import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import TypeDoc from 'typedoc';

/**
 * Generate a slug for the node.
 * @param {import('typedoc').JSONOutput.Reflection} node The node to generate a slug for.
 * @returns {string} The slug string.
 */
function slug(node) {
    return node.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

/**
 * Get group children.
 * @param {import('typedoc').JSONOutput.ReflectionGroup} group The group to get children for.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {import('typedoc').JSONOutput.Reflection[]} The reflection children.
 */
function getChildren(group, json) {
    const projectChildren = json.children;
    if (!projectChildren) {
        return [];
    }
    if (!group.children) {
        return [];
    }
    return group.children.map((child) => /** @type {import('typedoc').JSONOutput.Reflection} */ (projectChildren.find(({ id }) => (id === child))));
}

/**
 * Render node description.
 * @param {import('typedoc').JSONOutput.Reflection} node The target node.
 * @returns {string} The rendered HTML for node description.
 */
function getDescription(node) {
    return node.comment && node.comment.shortText || '';
}

/**
 * Render return description.
 * @param {import('typedoc').JSONOutput.DeclarationReflection} node The target node.
 * @returns {string} The rendered HTML for return description.
 */
function getReturnDescription(node) {
    if (!node.signatures) {
        return '';
    }
    const signature = node.signatures[0];
    if (!signature) {
        return '';
    }
    return signature.comment && signature.comment.returns || '';
}

/**
 * Get a list of tags for the node.
 * @param {import('typedoc').JSONOutput.Reflection} node The target node.
 * @param {string} name The tag name.
 * @returns {import('typedoc').JSONOutput.CommentTag[]} A list of comment tags.
 */
function getTags(node, name) {
    if (!node.comment) {
        return [];
    }
    if (!node.comment.tags) {
        return [];
    }
    return node.comment.tags.filter((tag) => tag.tag === name);
}

/**
 * Render link.
 * @param {import('typedoc').JSONOutput.Reflection} node The target node.
 * @returns {string} The rendered HTML link.
 */
function renderLink(node) {
    return `<a href="#${slug(node)}">${node.name}</a>`;
}

/**
 * Render summary.
 * @param {import('typedoc').JSONOutput.ReflectionGroup[]} groups A list of nodes.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} The rendered HTML summary.
 */
function renderSummary(groups, json) {
    if (!groups.length) {
        return '';
    }

    return groups.map((group) => `
<strong>${group.title.replace(' aliases', 's')}</strong>

${getChildren(group, json).map((node) => renderLink(node)).join(', ')}
`).join('\n\n');
}

/**
 * Render a group of nodes.
 * @param {import('typedoc').JSONOutput.ReflectionGroup} group The group to render.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} The rendered HTML for the group.
 */
function renderGroup(group, json) {
    return getChildren(group, json)
        .map((node) => `\n<hr />\n\n${renderNode(node, json)}`)
        .join('\n');
}

/**
 * Render a node.
 * @param {import('typedoc').JSONOutput.Reflection} node The node to render.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} The rendered markdown for the node.
 */
function renderNode(node, json) {
    switch (node.kindString) {
        case 'Class':
            return renderClass(node, json);
        case 'Function':
            return renderFunction(node, json);
        case 'Type alias':
            return renderTypeAlias(node, json);
        case 'Variable':
            return renderVariable(node, json);
    }
    return `<span id="${slug(node)}">${renderKind(node)}${node.name}</span>`;
}

/**
 * Render node kind.
 * @param {import('typedoc').JSONOutput.Reflection} node The target node.
 * @returns {string} The rendered markdown for the kind.
 */
function renderKind(node) {
    if (!node.kindString) {
        return '';
    }
    return `<code>${node.kindString.replace(' alias', '')}</code> `;
}

/**
 * Render a type alias.
 * @param {import('typedoc').JSONOutput.DeclarationReflection} node The target node.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} The rendered markdown for the type alias node.
 */
function renderTypeAlias(node, json) {
    const description = getDescription(node);
    const samples = getTags(node, 'example');
    const links = getTags(node, 'see');
    return `<strong${` id="${slug(node)}"`}><code>Type</code> ${node.name}${node.typeParameter ? renderTypeParams(node.typeParameter, json) : ''}</strong>
    ${renderInfo(node)}
${description ? `<p>

${description.trim()}

</p>
` : ''}

<pre>${renderType(node.type, json)}</pre>

${samples.length ? `
<strong>Examples</strong>

${renderExamples(samples)}

` : ''}
${links.length ? `
<strong>See also</strong>

${renderLinks(links)}` : ''}

`;
}

/**
 * Render a variable.
 * @param {import('typedoc').JSONOutput.DeclarationReflection} node The target node.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} The rendered markdown for the variable node.
 */
function renderVariable(node, json) {
    const description = getDescription(node);
    return `<strong${` id="${slug(node)}"`}><code>Variable</code> ${node.name}${node.typeParameter ? renderTypeParams(node.typeParameter, json) : ''}</strong>
    ${renderInfo(node)}
${description ? `<p>

${description.trim()}

</p>
` : ''}

<pre>${renderType(node.type, json)}</pre>
`;
}

/**
 * Render JSDoc examples.
 * @param {import('typedoc').JSONOutput.CommentTag[]} samples Comment nodes with examples.
 * @returns {string} A HTML chunk with examples.
 */
function renderExamples(samples) {
    return samples
        .map((tag) => tag.text)
        .join('\n\n')
        .replace(/</g, '&lt;')
        .replace(/＠/g, '@');
}

/**
 * Render node informations.
 * @param {import('typedoc').JSONOutput.Reflection} node The target node.
 * @returns {string} A HTML chunk with node infos.
 */
function renderInfo(node) {
    const deprecated = getTags(node, 'deprecated')[0];
    const since = getTags(node, 'since')[0];
    if (!deprecated && !since) {
        return '';
    }
    let message = '';
    if (deprecated) {
        message += `<strong>Deprecated</strong> ${deprecated.text || ''}  \n`;
    }
    if (since && since.text) {
        message += `<strong>Since</strong> ${since.text}  \n`;
    }
    return `${message}`;
}

/**
 * Render a list of links.
 * @param {import('typedoc').JSONOutput.CommentTag[]} links Link nodes.
 * @returns {string} Links list markdown.
 */
function renderLinks(links) {
    return links
        .map((tag) => `* ${tag.text}`)
        .join('\n\n');
}

/**
 * Render a function.
 * @param {import('typedoc').JSONOutput.DeclarationReflection} node The function node to render.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} The rendered markdown for the function.
 */
function renderFunction(node, json) {
    const signatures = node.signatures || [];
    const description = getDescription(node);
    const samples = getTags(node, 'example');
    const links = getTags(node, 'see');
    const returnDescription = getReturnDescription(node);
    return `<strong${node.kindString === 'Constructor' ? '' : ` id="${slug(node)}"`}><code>Function</code> ${node.name}</strong>

${renderInfo(node)}

${description ? `<p>

${description.trim()}

</p>
` : ''}
${signatures.map((signature) => `<details>
<summary>
    <code>${renderSignature(signature, json, false)}</code>
</summary>

${signature.parameters && signature.parameters.length ? `
<strong>Params</strong>
<table>
    <thead>
        <th align="left">Name</th>
        <th align="left">Type</th>
        <th align="center">Optional</th>
        <th align="left">Description</th>
    </thead>
    <tbody>
        <tr>${signature.parameters.map((param) => `
            <td>${param.name}</td>
            <td><code>${renderType(param.type, json)}</code></td>
            <td align="center">${param.flags && param.flags.isOptional ? '✓' : ''}</td>
            <td>${getDescription(param)}</td>`).join('</tr>\n<tr>')}
        </tr>
    </tbody>
</table>


` : ''}
${signature.type ? `<strong>Returns</strong>: <code>${renderType(signature.type, json).replace(/\n/g, ' ')}</code> ${returnDescription || ''}` : ''}

</details>`).join('\n')}

${samples.length ? `
<strong>Examples</strong>

${renderExamples(samples)}

` : ''}
${links.length ? `
<strong>See also</strong>


${renderLinks(links)}


` : ''}
`;
}

/**
 * Render function param.
 * @param {import('typedoc').JSONOutput.ParameterReflection} node The target parameter node.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} A HTML chunk with param infos.
 */
function renderParam(node, json) {
    return `${node.name}${node.flags.isOptional ? '?' : ''}: ${renderType(node.type, json)}`;
}

/**
 * Render function signature.
 * @param {import('typedoc').JSONOutput.SignatureReflection} node The target signature node.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @param {boolean} arrow Render arrow or colon.
 * @returns {string} A HTML chunk with function signature infos.
 */
function renderSignature(node, json, arrow = true) {
    return `${node.kindString === 'Constructor signature' ? 'new ' : ''}${node.typeParameter ? renderTypeParams(node.typeParameter, json) : ''}(${node.parameters ? node.parameters.map((param) => renderParam(param, json)).join(', ') : ''})${arrow ? ' =>' : ':'} ${renderType(node, json)}`;
}

/**
 * Render type params.
 * @param {import('typedoc').JSONOutput.TypeParameterReflection[]} nodes A list of type param nodes.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} A HTML chunk with type params.
 */
function renderTypeParams(nodes, json) {
    return `&lt;${nodes.map((type) => renderTypeParam(type, json)).join(', ')}&gt;`;
}

/**
 * Render node type param.
 * @param {import('typedoc').JSONOutput.TypeParameterReflection} node The target node.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} A HTML chunk with param type.
 */
function renderTypeParam(node, json) {
    return `${node.name}${node.type ? ` extends ${renderType(node, json)}` : ''}`;
}

/**
 * Render node type.
 * @param {*} node The target node.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} A HTML chunk with node type.
 */
function renderType(node, json) {
    if (node.type === 'literal') {
        return `${node.value}`;
    }
    if (node.type === 'intrinsic') {
        return node.name;
    }
    if (node.type === 'reflection') {
        return renderType(node.declaration, json);
    }
    if (node.type === 'query') {
        return renderType(node.queryType, json);
    }
    if (node.type === 'reference') {
        return renderLink(node);
    }
    if (node.type === 'array') {
        const type = renderType(node.elementType, json);
        return `${type.replace(/(<([^>]+)>)/gi, '').trim().includes(' ') ? `(${type})` : type}[]`;
    }
    if (node.type === 'predicate') {
        return `${node.asserts ? 'assert ' : ''}${node.name} is ${renderType(node.targetType, json)}`;
    }
    if (node.type === 'intersection') {
        return node.types.map(
            (type) => renderType(type, json)
        ).join(' & ');
    }
    if (node.type === 'union') {
        return node.types.map(
            (type) => renderType(type, json)
        ).join(' | ');
    }
    if (node.type === 'tuple') {
        return `[${node.elements.map(
            (type) => renderType(type, json)
        ).join(', ')}]`;
    }
    if (typeof node.type === 'object') {
        return renderType(node.type, json);
    }
    if (node.indexSignature) {
        return renderType(node.indexSignature, json);
    }
    if (node.signatures) {
        return node.signatures.map(
            (type) => renderSignature(type, json)
        ).join('\n');
    }
    if (node.id) {
        return renderObject(node, json);
    }

    return '';
}

/**
 * Render class properties and methods.
 * @param {import('typedoc').JSONOutput.DeclarationReflection} node The class node.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} A HTML chunk with class properties and methods.
 */
function renderClass(node, json) {
    const description = getDescription(node);
    const samples = getTags(node, 'example');
    const links = getTags(node, 'see');

    /**
     * @type {import('typedoc').JSONOutput.DeclarationReflection[]}
     */
    const instanceProperties = [];
    /**
     * @type {import('typedoc').JSONOutput.DeclarationReflection[]}
     */
    const staticProperties = [];

    (node.children || [])
        .filter((member) => member.kindString === 'Property')
        .forEach((member) => {
            if (member.flags.isStatic) {
                staticProperties.push(member);
            } else {
                instanceProperties.push(member);
            }
        });

    /**
     * @type {import('typedoc').JSONOutput.DeclarationReflection[]}
     */
    const instanceMethods = [];
    /**
     * @type {import('typedoc').JSONOutput.DeclarationReflection[]}
     */
    const staticMethods = [];
    (node.children || [])
        .filter((member) => member.kindString === 'Method' || member.kindString === 'Constructor')
        .forEach((member) => {
            if (member.flags.isStatic) {
                staticMethods.push(member);
            } else {
                instanceMethods.push(member);
            }
        });

    return `<strong id="${slug(node)}"><code>Class</code> ${node.name}</strong>

${renderInfo(node)}

${node.extendedTypes && node.extendedTypes.length ? `<strong>Extends:</strong> ${renderType(node.extendedTypes[0], json)}` : ''}
${description ? `<p>

${description.trim()}

</p>` : ''}

${samples.length ? `
<strong>Examples</strong>

${renderExamples(samples)}` : ''}

${instanceProperties.length ? `
<strong>Propertie</strong>

${renderProperties(instanceProperties)}` : ''}

${instanceMethods.length ? `
<strong>Methods</strong>

${instanceMethods.map((method) => renderFunction(method, json)).join('\n\n')}` : ''}

${staticProperties.length ? `
<strong>Static properties</strong>

${renderProperties(staticProperties)}` : ''}

${staticMethods.length ? `
<strong>Static methods</strong>

${staticMethods.map((method) => renderFunction(method, json)).join('\n\n')}` : ''}

${links.length ? `
<strong>See also</strong>

${renderLinks(links)}` : ''}

`;
}

/**
 * Render an object.
 * @param {import('typedoc').JSONOutput.ContainerReflection} node The object node.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @param {number} level The indentation level.
 * @param {number} size The indentation size.
 * @returns {string} A HTML chunk with object properties and methods.
 */
function renderObject(node, json, level = 1, size = 2) {
    return `{
${(node.children || [])
        .map(
            (child) => {
                if (child.kindString === 'Property') {
                    return renderProperty(child, json);
                }
                if (child.kindString === 'Method') {
                    return renderMethod(child, json);
                }
                return renderNode(child, json);
            }
        ).map((line) => line.replace(/^/gm, ''.padStart(size * level, ' '))).join(';\n')}
}`;
}

/**
 * Render a properties table.
 * @param {import('typedoc').JSONOutput.DeclarationReflection[]} nodes The nodes to render.
 * @returns {string} The HTML chunk.
 */
function renderProperties(nodes) {
    return `<table>
        <thead>
            <th align="left">Name</th>
            <th align="left">Type</th>
            <th align="left">Readonly</th>
            <th align="left">Description</th>
        </thead>
        <tbody>
            <tr>${nodes.map((prop) => `
                <td>${prop.name}</td>
                <td><code>${prop.kindString}</code></td>
                <td align="center">${(prop.flags.isReadonly) ? '✓' : ''}</td>
                <td>${getDescription(prop)}</td>`).join('</tr>\n<tr>')}
            </tr>
        </tbody>
    </table>`;
}

/**
 * Render a class property.
 * @param {import('typedoc').JSONOutput.DeclarationReflection} node The property node.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} The HTML chunk for the property node.
 */
function renderProperty(node, json) {
    return `${node.name}${node.flags.isOptional ? '?' : ''}: ${renderType(node.type, json)}`;
}

/**
 * Render a class method.
 * @param {import('typedoc').JSONOutput.DeclarationReflection} node The method node.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} The HTML chunk for the method node.
 */
function renderMethod(node, json) {
    if (!node.signatures) {
        return `${node.name}(): unknown`;
    }
    return node.signatures
        .map((signature) => `${node.name}${renderSignature(signature, json, false)}`)
        .join('\n');
}

/**
 * Render a typedoc JSON to markdown.
 * @param {import('typedoc').JSONOutput.ProjectReflection} json The typedoc JSON result.
 * @returns {string} The markdown output.
 */
function markdown(json) {
    let output = '';
    if (json.groups) {
        const groups = json.groups.filter((group) => group.children && group.children.length);
        output += renderSummary(groups, json);

        if (groups.length) {
            output += '\n';
            output += groups
                .map((group) => renderGroup(group, json))
                .join('\n');
        }
    }

    return output.replace(/\n{3,}/g, '\n\n').trim();
}

const app = new TypeDoc.Application();
app.options.addReader(new TypeDoc.TSConfigReader());
app.options.addReader(new TypeDoc.TypeDocReader());

await app.bootstrapWithPlugins();

app.bootstrap({
    entryPoints: [
        fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    ],
});

const project = app.convert();
const json = await app.serializer.projectToObject(project, fileURLToPath(new URL('../', import.meta.url)));
const data = `# API Reference
${markdown(json)}`;

await writeFile(fileURLToPath(new URL('../docs/API.md', import.meta.url)), data);
