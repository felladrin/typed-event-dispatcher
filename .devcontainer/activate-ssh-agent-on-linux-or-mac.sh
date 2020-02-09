RUNNING_AGENT="`ps -ax | grep 'ssh-agent -s' | grep -v grep | wc -l | tr -d '[:space:]'`"

if [ "$RUNNING_AGENT" = "0" ]
then
  eval "$(ssh-agent -s)"
fi

ssh-add $HOME/.ssh/id_rsa
