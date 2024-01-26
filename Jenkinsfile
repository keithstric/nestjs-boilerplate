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
        stage('Cleanup Local Docker Image and Jenkins environment') {
            steps {
                echo 'Cleaning up docker images and environment variables'
                sh "docker image rm ${imageId}"
                sh "docker image rm node"
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
