const program = require('commander')
const { version } = require('./utils/constants')

// 配置命令模板
const actionsMap = {
  create: {
    description: 'create project',
    alias: 'cr',
    examples: [
      'wa-cli create <temlpate-name>'
    ]
  },
  config: {
    description: 'config info',
    alias: 'c',
    examples: [
      'wa-cli config get <k>',
      'wa-cli config set <k> <v>',
    ]
  },
  '*': {
    description: 'command not found'
  }
}

// 循环创建命令
Object.keys(actionsMap).forEach(action => {
  program
    .command(action) // 命令的名称
    .description(actionsMap[action].description) // 命令的描述
    .action(() => { // 动作
      if (action === '*') { // 如果动作没匹配到说明输入有误
        console.log(actionsMap[action].description)
      } else { // 引用对应的动作文件 将参数传入
        require(path.resolve(__dirname, action))(...process.argv.slice(3))
      }
    })
    // 此处的alias需要放到最后，不知是不是bug
    .alias(actionsMap[action].alias) // 命令的别名
})

// 编写help 命令
program.on('--help', () => {
  console.log('Example');
  Object.keys(actionsMap).forEach(action => {
    (actionsMap[action].examples || []).forEach(example => {
      console.log(` ${example}`)
    })
  })
})

program.version(version)
  .parse(process.argv) // process.argv就是用户在命令行中传入的参数