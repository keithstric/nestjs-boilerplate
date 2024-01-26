pipeline {
    agent any
    tools {nodejs "Node 21.6"}
    environment {
        version = ''
        imageId = ''
        imageName = 'keithstric/nestjs-boilerplate'
        newVersion = ''
        newVersionTag = ''
        repoUrl = 'https://github.com/keithstric/nestjs-boilerplate.git'
        repoUrlPath = 'github.com/keithstric/nestjs-boilerplate.git'
        repoBranch = 'master'
    }
    stages {
        stage('Node Install') {
            when {
                beforeAgent true
                branch "${repoBranch}"
            }
            steps {
                echo 'Installing dependencies...'
                git branch: "${repoBranch}", credentialsId: '2e31314d-3846-45a9-b554-76317c61b288', url: "${repoUrl}"
                script {
                    version = readJSON(file: './package.json').version
                }
                sh 'npm install'
            }
        }
        stage('Testing') {
            steps {
                echo 'Running Unit Tests'
                sh 'npm run test'
            }
        }
        stage('Build and bump version') {
            steps {
                echo 'Starting the build...'
                sh 'npm run build --only=production'
                sh 'npm run bump-version:patch'
                script {
                    newVersion = readJSON(file: './package.json').version
                    newVersionTag = "v${newVersion}"
                }
            }
        }
        stage('Build/Push Docker Image...') {
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
        stage('Tagging and Updating Branch with new version') {
            steps {
                echo "Tagging git branch with new version tag ${newVersionTag}"
                withCredentials([usernamePassword(credentialsId: '2e31314d-3846-45a9-b554-76317c61b288', passwordVariable: 'GITHUB_PW', usernameVariable: 'GITHUB_USER')]) {
                    sh '''
                        git config --global credential.username $GITHUB_USER
                        git config --global credential.helper '!f() { echo password=$GITHUB_PW; }; f'
                        git config --global user.name "Jenkins"
                        git config --global user.email "keithstric@gmail.com"
                    '''
                    sh """
                        git add package.json
                        git commit -m 'Jenkins updated build version to ${newVersion}'
                        git tag -f ${newVersionTag}
                        git push https://${env.GITHUB_USER}:${env.GITHUB_PW}@${repoUrlPath}
                        git push -f https://${env.GITHUB_USER}:${env.GITHUB_PW}@${repoUrlPath} --tags
                    """
                }
            }
        }
        stage('Cleanup Local Docker Image and Jenkins environment') {
            steps {
                echo 'Cleaning up docker images and environment variables'
                sh "docker image rm ${imageId}"
                script {
                    version = ''
                    imageId = ''
                    imageName = ''
                    newVersion = ''
                    newVersionTag = ''
                    repoUrl = ''
                    repoUrlPath = ''
                    repoBranch = ''
                }
            }
        }
    }
}
