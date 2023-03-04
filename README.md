# nodejs-express-on-aws-ec2-ci-cd

## Create IAM ROLE
    1: Create Role
    2: Select EC2
    3: select permission policy for  "AWSCodeDeployRole" and Create Role
    4: Create 2nd Role for CodeDeploy
    5: Select CodeDeploy => CodeDeploy and Create Role
## Add Role to EC2 instance
    1: new EC2 instance
        a: select IAM Role as our created "AWSCodeDeployRole" ans custom name
    2: existing EC2 instance
        a: select EC2 instance
        b: Actons dropdown
        c: Security/ instance Settings
        d: Modify IAM Role
        e: Select IAM Role and update IAM Role

## add user data 
    1: existing instance 
        a: stop instance 
        b: select instance
        c: actions => instance settings => Edit User Data
        d: select Modify user data as text 
        e: copy & past bellow code as EC2 script
        d: start instance
    2: new instance:
        a: select "User Data" => "as text"
        b: copy & past bellow code as EC2 script
## EC2 script on creation to install the CodeDeploy Agent:

    AWS Linux
        #!/bin/bash
        sudo yum -y update
        sudo yum -y install ruby
        sudo yum -y install wget
        cd /home/ec2-user
        wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install
        sudo chmod +x ./install
        sudo ./install auto

    for ubuntu

        #!/bin/bash
        sudo apt update
        sudo apt install ruby-full
        sudo apt install wget
        cd /home/ubuntu
        wget https://bucket-name.s3.region-identifier.amazonaws.com/latest/install
        sudo chmod +x ./install
        sudo ./install auto


## CodeDeploy

    1: Create Application
        a: create app name
        b: select ec2 instance
    2: Create Deployment Group
        a: Enter deployment group name
        b: Service Role
            CodeDeployRole
        c: slect Deployment type as "in-place"
        d: Environment Configuration
            Amazon EC2 instance
        e: Agent configuration with AWS Systems Manager
            Now and schedule updates
        f: Deployment settings
            CodeDeployDefault.ALlAtOnce
## Advanced - Optional
        a: Triggers
        b: Alarms: need to enable sns service
        c: Rollbacks: 
            1: Roll back when a deployment fails
            2: Roll back when alarm thresholds are met
            3: Disable rollbacks
# Pipeline
        1: Pipelines
        2: Create a Pipeline
        3: type pipeline name
        4: service Role = > new service Role
        5: Role name
        6: Advanced Settings
            a: Artifact Store => Default Location
            b: Encryption Key => default aws Manged key => next
        7: add source stage => github ( version 2 ) 
        8: Connect to Github => connections name => login with github
        9: install new app
        10: signin
        11: Repository Access => all repositories => save => connect
        12: Repository Name: select Repository
        13: Select brance
        14: add build stage
            a: node app => skip build stage
            b: react/angulam etc => select build provier => next
        15: Deploy
            a: Deploy provider => aws CodeDeploy
            b: Application name => slect app name
            c: Deploy group => select group
        16: view all config => create pipeline => done


https://www.youtube.com/watch?v=Buh3GjHPmjo

appspec.yml file for aws linux

version: 0.0
os: linux
files:
  - source: /
    destination: /home/ec2-user/express-app
hooks:
  ApplicationStop:
    - location: scripts/application_stop.sh
      timeout: 300
      runas: ec2-user
  BeforeInstall:
    - location: scripts/before_install.sh
      timeout: 300
      runas: ec2-user
  ApplicationStart:
    - location: scripts/application_start.sh
      timeout: 300
      runas: ec2-user


for ubuntu

    version: 0.0
os: linux
files: 
  - source: /
   distinations: /home/ubuntu/apps/express-app-ci-cd
hooks:
  ApplictionStop:
    - location: scripts/application_stop.sh
      timeout: 300
      runas: ubuntu
  BeforeInstall:
    - location: scripts/before_install.sh
      timeout: 300
      runas: ubuntu
  ApplicationStart:
    - location: scripts/application_start.sh
      timeout: 300
      runas: ubuntu




