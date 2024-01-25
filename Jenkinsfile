pipeline {
    agent any
    tools {nodejs "Node 21.6"}
    environment {
        version = ''
        imageId = ''
        imageName = 'keithstric/nestjs-boilerplate'
        newVersion = ''
        newVersionTag = ''
    }
    stages {
        stage('Node Install') {
            steps {
                echo 'Installing dependencies...'
                git credentialsId: '2e31314d-3846-45a9-b554-76317c61b288', url: 'https://github.com/keithstric/nestjs-boilerplate.git'
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
        stage('Build') {
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
        stage('Tag Branch with new version') {
            steps {
                echo "Tagging git branch with new version tag ${newVersionTag}"
                script {
                    withCredentials([usernameColonPassword(credentialsId: '2e31314d-3846-45a9-b554-76317c61b288', variable: '')]) {
                        git tag ${newVersionTag}
                        git push origin ${newVersionTag}
                    }
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
        stage('Cleanup Docker Image') {
            steps {
                echo 'Cleaning up docker images'
                script {
                    "docker image rm ${imageId} node"
                }
            }
        }
    }
}
