const path = require("path")
const util = require("util")
const { exec } = require("child_process")

const promisifyExec = util.promisify(exec)

const init = async () => {
  const { version } = require("../package.json")

  console.info("Build")

  await promisifyExec("pnpm build")

  console.info("Pack")

  await promisifyExec(`pnpm pack`)

  console.info(`Created archive: ${path.resolve(`kseniass-react-flow-editor-${version}.tgz`)}`)
}

init()
