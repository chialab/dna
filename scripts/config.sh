SSH_DIR="$HOME/.ssh"
KEY_NAME="id_rsa"
GITLAB_URL="gitlab.com"

git config --global user.email "bot@chialab.io"
git config --global user.name "Chialab BOT"
git config --global push.default simple

mkdir -p "${SSH_DIR}"
chmod -v -R 700 "${SSH_DIR}"

touch "${SSH_DIR}/${KEY_NAME}"
touch "${SSH_DIR}/${KEY_NAME}.pub"
touch "${SSH_DIR}/known_hosts"
touch "${SSH_DIR}/config"

{
    echo "${BOT_SSH_PRIVATE_KEY}"
} > "${SSH_DIR}/${KEY_NAME}"

{
    echo "${BOT_SSH_KEY}"
} > "${SSH_DIR}/${KEY_NAME}.pub"

{
    echo "host ${GITLAB_URL}"
    echo " HostName ${GITLAB_URL}"
    echo " IdentityFile ${SSH_DIR}/${KEY_NAME}"
    echo " User git"
} > "${SSH_DIR}/config"

chmod 700 "${SSH_DIR}/known_hosts"
chmod 700 "${SSH_DIR}/${KEY_NAME}"
chmod 700 "${SSH_DIR}/${KEY_NAME}.pub"

ssh-keyscan -H $GITLAB_URL >> "${SSH_DIR}/known_hosts"
