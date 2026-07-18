// pipeline{
//   agent{
//     docker{
//       image 'node:22-alpine'
//     }
//   }
//   stages{
//     stage('Checkout'){
//       steps{
//         echo 'Downloading Source Code...'
//         checkout scm
//       }
//     }
//     stage('Environment'){
//       steps{
//         echo 'Versions'
//         sh 'node --version'
//         sh 'npm --version'
//       }
//     }
//     stage('Installing Dependencies'){
//       steps{
//         echo 'Installing npm packages...'
//         sh 'npm install'
//       }
//     }
//     stage('Build'){
//       steps{
//         echo 'Building the project...'
//         sh 'npm run build'
//       }
//     }
    
//   }
//   post{
//     success{
//       echo 'Build successfull'
//     }
//     failure{
//       echo 'Build Failed'
//     }
//   }
// }

pipeline {
    agent {
        docker {
            image 'node:22-alpine'
        }
    }

    stages {
        stage('Test') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }
    }
}
