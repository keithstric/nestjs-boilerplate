pipeline {
    agent any
    tools {nodejs "Node 21.6"}
    stages {
        stage('Node Install') {
            steps {
                echo 'Installing dependencies...'
                git credentialsId: 'github-keithstric', url: 'https://github.com/keithstric/nestjs-boilerplate.git'
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
                sh 'npm run build'
            }
        }
        stage('Build Docker Image...') {
            steps {
                echo 'Building the docker image...'
                def nestjsBPImage = docker.build("keithstric/nestjs-boilerplate")
                nestjsBPImage.push()
                nestjsBPImage.push('latest')
            }
        }
    }
}
