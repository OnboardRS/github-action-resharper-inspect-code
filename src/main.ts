import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import {Installer} from './installer'
import {Report} from './report'
import path from 'path'
import fs from 'fs';

async function run(): Promise<void> {
  try {
    const installer = new Installer()
    const version: string = core.getInput('resharperCliVersion')
    await installer.install(version)

    const cwd = process.cwd()

    const solutionPath: string = path.join(cwd, core.getInput('solutionPath'))
    const outputPath = path.join(cwd, 'result.xml')

    let command = `jb inspectcode -o=${outputPath} -a ${solutionPath} --build`
    let defaultProfilePath = `${solutionPath}.DotSettings`
    
    const minimumReportSeverity = core.getInput('minimumReportSeverity') ?? ''
    if (minimumReportSeverity !== '') {
      command += ` --severity=${minimumReportSeverity}`
    }

    const profilePath = core.getInput('profilePath') ?? ''
    if (profilePath !== '') {
      command += ` --profile=${profilePath}`
    }
    else if(fs.existsSync(defaultProfilePath))    {      
      command += ` --profile=${defaultProfilePath}`
    }

    const exclude = core.getInput('exclude') ?? ''
    if (exclude !== '') {
      command += ` --exclude=${exclude}`
    }

    command += ' --properties:Configuration=Release'

    console.log(`Excecuting command as: ${command}`)
    await exec.exec(command)

    const ignoreIssueType = core.getInput('ignoreIssueType') ?? ''

    const report = new Report(outputPath, ignoreIssueType)
    report.output()

    const failOnIssue = core.getInput('failOnIssue')
    const minimumSeverity = core.getInput('minimumFailSeverity') ?? 'notice'

    if (failOnIssue !== '1') {
      return
    }

    if (report.issueOverThresholdIsExists(minimumSeverity)) {
      core.setFailed('Issue(s) exist.')
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
