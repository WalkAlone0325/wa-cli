const axios = require('axios')
const ora = require('ora')
const Inquirer = require('inquirer')
const { promisify } = require('util')
const downLoadGit = require('download-git-repo')
// const config = require('./config')
// const repoUrl = config('getVal', 'repo')

const downLoadGit1 = promisify(downLoadGit)

const repoUrl = 'zhu-cli'

// 1. 获取仓库列表
const fetchRepoList = async () => {
  // https://api.github.com/users/WalkAlone0325/repos
  const { data } = await axios.get(`https://api.github.com/orgs/zhu-cli/repos`)
  return data
}
// 获取版本信息
const fetchTagList = async (repo) => {
  const { data } = await axios.get(`https://api.github.com/repos/zhu-cli/${repo}/tags`);
  return data
}

// 封装spinner
const wrapFetchAddLoding = (fn, message) => async (...args) => {
  const spinner = ora(message)
  spinner.start() // 开始loading
  const r = await fn(...args)
  spinner.succeed() // 结束loading
  return r
}

// 下载项目
// const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`
const downloadDirectory = `./template`
// console.log(process.env.pwd);

const download = async (repo, tag) => {
  let api = `zhu-cli/${repo}` // 下载项目
  if (tag) {
    api += `#${tag}`
  }
  const dest = `${downloadDirectory}/${repo}` // 将模板下载到对应的目录中
  await downLoadGit1(api, dest)
  return dest // 返回下载目录
}

// 创建项目
module.exports = async projectName => {
  let repos = await wrapFetchAddLoding(fetchRepoList, 'fetching repo list')()
  // 选择模板
  repos = repos.map(item => item.name)
  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: repos
  })
  console.log(repos)
  // console.log(projectName)

  // 获取版本信息
  let tags = await wrapFetchAddLoding(fetchTagList, 'fetching tag list')(repo)
  // 选择版本
  tags = tags.map((item) => item.name);
  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: tags,
  })
  const target = await wrapFetchAddLoding(download, 'download template')(repo, tag)
  console.log(`
    $ cd template/${repo}
    $ npm install
  `)
}
