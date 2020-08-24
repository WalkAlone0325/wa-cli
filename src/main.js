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
    .alias(actionsMap[action].alias) // 命令的别名
    .description(actionsMap[action].description) // 命令的描述
    .action(() => { // 动作
      console.log(action);
    })
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
  // eslint-disable-next-line no-undef
  .parse(process.argv) // process.argv就是用户在命令行中传入的参数