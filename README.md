# CanYaCoin Hodl Club

## Installing

cd into the directories `admin`, `MainApiServer`, `Proxy` and `Site` and run `yarn` in each

### (install mongodb)[https://docs.mongodb.com/manual/installation/]

Start mongo daemon

## Run the cron script to populate the hodlers

*For this you will need a fully synced blockchain*, Parity or Geth will do the job.

Export the IPC with `export PARITY_IPC_PATH=/path/to/my/jsonrpc.ipc`

`node ./MainApiServer/cron/getHodlers.js -d 45`

Now you should be able to start the servers

## Start the servers

cd into this repo's root directory and run `node index.js`