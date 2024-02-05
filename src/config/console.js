import chalk from 'chalk'

const origConsole = global.console

global.console = {
  info: ( ...args ) => {
    origConsole.log.apply( origConsole, [
      `${ chalk.bgCyan.bold.italic(
        `> [${ new Date().toLocaleString() }]`
      ) } ${ chalk.cyan.bold( '[-]' ) }`,
      ...args
    ] )
  },

  log: ( ...args ) => {
    origConsole.log.apply( origConsole, [
      `${ chalk.blue.bold(
        `> [${ new Date().toLocaleString() }]`
      ) } ${ chalk.blue.bold( '[-]' ) }`,
      ...args
    ] )
  },

  warn: ( ...args ) => {
    origConsole.warn.apply( origConsole, [
      `${ chalk.black.bgYellow.bold(
        `> [${ new Date().toLocaleString() }]`
      ) } ${ chalk.yellow.bold( '[-]' ) }`,
      ...args
    ] )
  },

  error: ( ...args ) => {
    origConsole.error.apply( origConsole, [
      `${ chalk.white.bgRed.bold(
        `> [${ new Date().toLocaleString() }]`
      ) } ${ chalk.red.bold( '[-]' ) }`,
      ...args
    ] )
  },

  debug: ( ...args ) => {
    if ( process.env.NODE_ENV !== 'production' ) {
      origConsole.debug.apply( origConsole, [
        `${ chalk.white.bgMagenta.bold(
          `> [${ new Date().toLocaleString() }]`
        ) } ${ chalk.magenta.bold( '[-]' ) }`,
        ...args
      ] )
    }
  },

  getOriginal: () => origConsole
}

export default global.console
