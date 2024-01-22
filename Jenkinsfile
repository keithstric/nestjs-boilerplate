pipeline {
    agent any
    tools {nodejs "Node 21.6"}
    stages {
        stage('Node Install') {
            steps {
                echo 'Installing dependencies...'
                git credentialsId: 'github-keithstric', url: 'https://github.com/keithstric/node-typescript-boilerplate.git'
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                echo 'Starting the build...'
                sh 'npm run build'
            }
        }
    }
}
