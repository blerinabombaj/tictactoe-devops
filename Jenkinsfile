pipeline {
    agent any

    environment {
        // Update with your actual Jenkins credentials IDs
        GIT_CREDENTIALS = 'github-ssh'
        DOCKERHUB_CREDENTIALS = 'dockerhub'
        DOCKER_CMD = '/usr/local/bin/docker'
        IMAGE_NAME = 'digdigdigdig/tictactoe:latest'
        KUBECONFIG = '/Users/robertlleshi/.kube/config'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/blerinabombaj/tictactoe-devops.git',
                        credentialsId: "${GIT_CREDENTIALS}"
                    ]]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "${DOCKER_CMD} build -t ${IMAGE_NAME} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKERHUB_CREDENTIALS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo $DOCKER_PASS | ${DOCKER_CMD} login -u $DOCKER_USER --password-stdin
                        ${DOCKER_CMD} push ${IMAGE_NAME}
                    """
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withEnv(["KUBECONFIG=${KUBECONFIG}"]) {
                    sh """
                        /opt/homebrew/bin/kubectl apply -f deployment.yaml
                        /opt/homebrew/bin/kubectl apply -f service.yaml
                        /opt/homebrew/bin/kubectl rollout status deployment/tictactoe-deployment
                    """
                }
            }
        }

    }

    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check the logs."
        }
    }
}
