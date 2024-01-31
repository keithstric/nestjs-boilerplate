def version
def imageId
def imageName
def newVersion
def newVersionTag
def repoUrl
def repoUrlPath
def repoBranch
def committer_name
def commit_msg

pipeline {
    agent any
    tools {nodejs "Node 21.6"}
    stages {
        stage ('Preparing Environment...') {
            steps {
                echo "Getting variables from git commit ${env.GIT_COMMIT}"
                script {
                  def packageJson = readJSON(file: './package.json')
                  version = packageJson.version
                  committer_name = sh(script: "git log -n 1 ${env.GIT_COMMIT} --format=%cN", returnStdout: true).trim()
                  commit_msg = sh(script: "git log -1 --format=%B ${GIT_COMMIT}", returnStdout: true).trim()
                  imageName = packageJson.config.dockerImage
                  repoBranch = packageJson.config.mainBranch
                  repoUrl = packageJson.repository.url
                  repoUrlPath = repoUrl.substring(8)
                }
                echo "Current version is ${version}"
                echo "Committer name of last commit is ${committer_name}"
                echo "Commit message of last commit is ${commit_msg}"
                echo "Repository Url is ${repoUrl}"
                echo "Repository Branch is ${repoBranch}"
                echo "Repository Url Path is ${repoUrlPath}"
                echo "Docker image name is ${imageName}"
            }
        }
        stage('NPM Install...') {
            when {
                beforeAgent true
                branch "${repoBranch}"
                expression {committer_name != 'Jenkins'}
            }
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }
        stage('Testing...') {
            when {
                beforeAgent true
                branch "${repoBranch}"
                expression {committer_name != 'Jenkins'}
            }
            steps {
                echo 'Running Unit Tests'
                sh 'npm run test'
            }
        }
        stage('Build and bump version...') {
            when {
                beforeAgent true
                branch "${repoBranch}"
                expression {committer_name != 'Jenkins'}
            }
            steps {
                echo 'Bumping patch version...'
                sh 'npm run bump-version:patch'
                script {
                    newVersion = readJSON(file: './package.json').version
                    newVersionTag = "v${newVersion}"
                }
                echo "Building version ${newVersion}..."
                sh 'npm run build --only=production'
            }
        }
        stage('Tagging and Updating Branch with new version...') {
            when {
                beforeAgent true
                branch "${repoBranch}"
                expression {committer_name != 'Jenkins'}
            }
            steps {
                echo "Tagging git branch with new version tag ${newVersionTag}"
                withCredentials([usernamePassword(credentialsId: '2e31314d-3846-45a9-b554-76317c61b288', passwordVariable: 'GITHUB_PW', usernameVariable: 'GITHUB_USER')]) {
                    sh """
                        git config --global credential.username $GITHUB_USER
                        git config --global credential.helper '!f() { echo password=$GITHUB_PW; }; f'
                        git config --global user.name "${GIT_GLOBAL_USER}"
                        git config --global user.email "${GIT_GLOBAL_EMAIL}"
                        git fetch --tags
                        git add package.json
                        git commit -m 'Jenkins - updated build version to ${newVersion}'
                        git tag -f ${newVersionTag}
                        git push https://${env.GITHUB_USER}:${env.GITHUB_PW}@${repoUrlPath} HEAD:"${repoBranch}"
                        git push -f https://${env.GITHUB_USER}:${env.GITHUB_PW}@${repoUrlPath} --tags
                    """
                }
            }
        }
        stage('Build/Push Docker Image...') {
            when {
                beforeAgent true
                branch "${repoBranch}"
                expression {committer_name != 'Jenkins'}
            }
            steps {
                echo 'Docker Build/Push Image....'
                script {
                    img = docker.build("${imageName}")
                    imageId = img.id
                    docker.withRegistry('', '6f4e66e4-4f43-4849-bc23-b17884e35526') {
                        img.push("${newVersion}")
                        img.push('latest')
                    }
                }
            }
        }
    }
    post {
        always {
            echo 'Cleaning up workspace'
            cleanWs notFailBuild: true
        }
        success {
            script {
                if (imageId?.trim()) {
                    echo 'Cleaning up docker images'
                    sh "docker image rm ${imageId}"
                }
            }
        }
    }
}
