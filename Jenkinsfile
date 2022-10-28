def remoteSIRHServer = [:]
remoteSIRHServer.name = "node"
remoteSIRHServer.host = "164.68.121.214"
remoteSIRHServer.allowAnyHosts = true

def remoteSIRHStagingServer = [:]
remoteSIRHStagingServer.name = "node"
remoteSIRHStagingServer.host = "75.119.129.19"
remoteSIRHStagingServer.allowAnyHosts = true

def remoteSIRHProdServer = [:]
remoteSIRHProdServer.name = "node"
remoteSIRHProdServer.host = "207.180.254.181"
remoteSIRHProdServer.allowAnyHosts = true

def registry = "62.171.158.130:8083/registry/techinstinct"
def dockerImage = "${registry}/sirh-employee-portal"
def committer

node {
      properties(
      [
          buildDiscarder(
              logRotator(
                  numToKeepStr: '10'
              )
          )
      ]
  )
    try{
      stage('checkout') {
        checkout scm
      }
      sh 'git log --format="%an" | head -1 > commit-author.txt'
      committer = readFile('commit-author.txt').trim()
      stage('Run sonanr analysis') {
        def scannerHome = tool 'TechInSonar';
              withSonarQubeEnv("techinSonar") {
                def nodeHome = tool 'node14'
                env.PATH = "${nodeHome}/bin:${env.PATH}"
                sh "npm install"
                sh "${scannerHome}/bin/sonar-scanner"
              }
      }

      stage("Quality Gate"){
            timeout(time: 1, unit: 'HOURS') {
                def qg = waitForQualityGate()
                if (qg.status != 'OK') {
                  error "Pipeline aborted due to quality gate failure: ${qg.status}"
                }
            }
        }

      stage('build docker image, tag it and push it') {
        def dockerHome = tool 'myDocker'
        env.PATH = "${dockerHome}/bin:${env.PATH}"
        sh "docker --version"

        def nodeHome = tool 'node14'
        env.PATH = "${nodeHome}/bin:${env.PATH}"

        def packageJSON = readJSON file: 'package.json'
        def VERSION = packageJSON.version
        sh "npm install"
        sh "npm run build-prod"
        sh "docker build  -t ${registry}/sirh-employee-portal:${VERSION} ."
        sh "docker push ${registry}/sirh-employee-portal:${VERSION}"      
        sh "docker rmi ${registry}/sirh-employee-portal:${VERSION}"      

      }

      stage('run sirh-employee-portal in the server') {
            def packageJSON = readJSON file: 'package.json'
            def VERSION = packageJSON.version
            if(env.BRANCH_NAME == 'dev-dep'){
                echo 'Try to run sirh-employee-portal in test platform'
                withCredentials([usernamePassword(credentialsId: 'sirh-server', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    remoteSIRHServer.user = USERNAME
                    remoteSIRHServer.password = PASSWORD
                    sshCommand remote: remoteSIRHServer, command: "cd ~/sirh/sirh-env && ./updateComposeVersion --src='sirh-employee-portal' --dst='$VERSION'" +
                    " --file='./docker-compose.yml' && docker-compose up -d"
                }
            }
            if(env.BRANCH_NAME == 'release'){
                echo 'Try to run sirh-employee-portal in staging platform'
                withCredentials([usernamePassword(credentialsId: 'rhp-staging', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    remoteSIRHStagingServer.user = USERNAME
                    remoteSIRHStagingServer.password = PASSWORD
                    sshCommand remote: remoteSIRHStagingServer, command: "cd ~/sirh/sirh-env && ./updateComposeVersion --src='sirh-employee-portal' --dst='$VERSION'" +
                    " --file='./docker-compose.yml' && docker-compose up -d"
                }
            }
            if(env.BRANCH_NAME == 'master'){
                echo 'Try to run sirh-employee-portal in prod platform'
                withCredentials([usernamePassword(credentialsId: 'sirh-staging-server', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    remoteSIRHProdServer.user = USERNAME
                    remoteSIRHProdServer.password = PASSWORD
                    sshCommand remote: remoteSIRHProdServer, command: "cd ~/sirh/sirh-env && ./updateComposeVersion --src='sirh-employee-portal' --dst='$VERSION'" +
                    " --file='./docker-compose.yml' && docker stack deploy -c docker-compose.yml --with-registry-auth staging-stack"
                }
            }
        }

        stage("increment pom version and push to gitlab if it's dev-dep branch") {
                if(env.BRANCH_NAME == 'dev-dep'){
                    git credentialsId: 'alilou-gitlab', url: 'https://gitlab.com/tech-instinct/sirh/sirh-employee-portal.git'
                    sh "git config user.email 'Jenkins@tech-instinct'"
                    sh "git config user.name 'Jenkins'"
                    withCredentials([usernamePassword(credentialsId: 'alilou-gitlab', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh "git checkout develop"
                        def packageJSON = readJSON file: 'package.json'
                        def VERSION = packageJSON.version
                        def minorIndex = VERSION.indexOf('.', VERSION.indexOf('.') + 1)
                        def newMinor = VERSION.substring(minorIndex + 1).toInteger() + 1
                        def newVersion = VERSION.substring(0,minorIndex + 1 ) + newMinor
                        sh "npm version $newVersion"
                        sh "git pull https://$USERNAME:$PASSWORD@gitlab.com/tech-instinct/sirh/sirh-employee-portal.git develop"
                        sh "git push https://$USERNAME:$PASSWORD@gitlab.com/tech-instinct/sirh/sirh-employee-portal.git"
                    }
                }
        }
    }
    catch (e) {
    // If there was an exception thrown, the build failed
    currentBuild.result = "FAILED"
    throw e
    } finally {
      // Success or failure, always send notifications
      notifyBuild(currentBuild.result, committer)
    }
}



def notifyBuild(String buildStatus = 'STARTED', String committer) {
  // build status of null means successful
  buildStatus =  buildStatus ?: 'SUCCESSFUL'

  // Default values
  def colorName = 'RED'
  def colorCode = '#FF0000'
  def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
  def summary = "${subject} (${env.BUILD_URL}) pushed by ${committer}"

  // Override default values based on build status
  if (buildStatus == 'STARTED') {
    color = 'YELLOW'
    colorCode = '#FFFF00'
  } else if (buildStatus == 'SUCCESSFUL') {
    color = 'GREEN'
    colorCode = '#00FF00'
  } else {
    color = 'RED'
    colorCode = '#FF0000'
  }

  // Send notifications
  slackSend (color: colorCode, message: summary,channel :"#sirh")
}