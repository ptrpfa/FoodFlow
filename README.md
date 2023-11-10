### Team 15 (Food Flow 🥨)
2200692 Pang Zi Jian Adrian <br>
2200959 Peter Febrianto Afandy <br>
2201014 Tng Jian Rong <br>
2200936 Muhammad Nur Dinie Bin Aziz <br>
2201132 Lionel Sim Wei Xian <br>
2201159 Ryan Lai Wei Shao <br>

### Overview
Food-Flow is a web-based platform designed to address the challenges of food waste and insecurity in Singapore, by facilitating the responsible redistribution of surplus food. It enables organizations to donate typically discarded excess food items to users in need for free, through listings and reservations.  

It is designed with users at its core, providing real-time notifications of food listings, efficient reservation management, and safeguarding the quality and safety of donated food items, through the employment of AWS cloud services and advanced technologies including browser-based federated learning and Apache Kafka. By leveraging a cloud-native and microservices-based infrastructure using Kubernetes and Docker, and robust data exchange through gRPC and web-sockets, Food-Flow provides a scalable and reliable system, ensuring accessibility and usability for a wide user base.  

Food-Flow is more than a platform; it is a step towards a world whereby every food item is valued and well-utilized. It is aimed at fostering a sense of community and shared responsibility amongst users, by empowering them to build a sustainable future together, one listing and reservation at a time. By connecting donors with users in need, Food-Flow promotes sustainable food practices and aims to reduce the impacts of food waste and insecurity in Singapore.  

### System Architecture
Food-Flow consists of 11 microservices that are orchestrated together using Docker, Kubernetes, and Web Sockets.
![System Architecture](/docs/arch.png)

### Program Usage
1. Run the following Docker container
    ```
    # Mac 
    docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/.kube/config:/root/.kube/config skyish/food-flow:mac
    ```


### Kubernetes
```
/app # kubectl get all -n food-flow
NAME                                                   READY   
pod/aws-s3-listing-deployment-64895d6868-rjm4f         1/1     
pod/aws-s3-listing-deployment-64895d6868-s2mkz         1/1     
pod/federated-flask-deployment-6d96d5d5f8-6c7pr        1/1     
pod/federated-flask-deployment-6d96d5d5f8-tlldh        1/1     
pod/kafka-deployment-1-f57fc5fbc-flsxx                 1/1     
pod/kafka-deployment-2-6f5769c7c5-kf2sz                1/1     
pod/react-auth-deployment-6b84556ddf-hc64l             1/1     
pod/react-auth-deployment-6b84556ddf-vzctj             1/1     
pod/react-envoy-deployment-6556f5fd57-fzh7x            1/1     
pod/react-frontend-deployment-8466d49c9-4vl2x          1/1     
pod/react-frontend-deployment-8466d49c9-htb7t          1/1     
pod/react-listing-deployment-6fdccb46ff-54th8          1/1     
pod/react-listing-deployment-6fdccb46ff-llmdq          1/1     
pod/react-reservation-deployment-6bb674fd69-4l85l      1/1     
pod/react-reservation-deployment-6bb674fd69-5s4lk      1/1     
pod/reservation-database-deployment-7ff47c6cc5-2k4fj   1/1     
pod/reservation-database-deployment-7ff47c6cc5-4p2j4   1/1     
pod/reservation-socket-deployment-6fd569cb79-7n8r4     1/1     
pod/reservation-socket-deployment-6fd569cb79-j2qbg     1/1     
pod/zookeeper-deployment-1-7989c6c445-vtxsw            1/1     
pod/zookeeper-deployment-2-7989c6c445-p92zn            1/1     

NAME                                 TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                          
service/aws-s3-listing-service       ClusterIP      10.109.119.33    <none>        5001/TCP                         
service/federated-flask-service      ClusterIP      10.111.180.72    <none>        80/TCP                           
service/kafka-service-1              LoadBalancer   10.104.148.45    localhost     9092:31079/TCP,29092:32098/TCP   
service/kafka-service-2              LoadBalancer   10.106.23.248    localhost     9092:31894/TCP,39092:32645/TCP   
service/react-auth-service           ClusterIP      10.110.72.235    <none>        5000/TCP                         
service/react-envoy-service          LoadBalancer   10.106.152.230   localhost     9900:30804/TCP,9901:30532/TCP    
service/react-frontend-service       LoadBalancer   10.96.102.193    localhost     3000:32241/TCP                   
service/react-listing-service        ClusterIP      10.99.112.80     <none>        5002/TCP                         
service/react-reservation-service    ClusterIP      10.100.44.246    <none>        5003/TCP                         
service/reservation-socket-service   LoadBalancer   10.107.145.32    localhost     8282:30626/TCP                   
service/zookeeper-service-1          LoadBalancer   10.101.138.251   localhost     22181:31424/TCP                  
service/zookeeper-service-2          LoadBalancer   10.100.180.172   localhost     32181:32064/TCP                  

NAME                                              READY   UP-TO-DATE   AVAILABLE   
deployment.apps/aws-s3-listing-deployment         2/2     2            2           
deployment.apps/federated-flask-deployment        2/2     2            2           
deployment.apps/kafka-deployment-1                1/1     1            1           
deployment.apps/kafka-deployment-2                1/1     1            1           
deployment.apps/react-auth-deployment             2/2     2            2           
deployment.apps/react-envoy-deployment            1/1     1            1           
deployment.apps/react-frontend-deployment         2/2     2            2           
deployment.apps/react-listing-deployment          2/2     2            2           
deployment.apps/react-reservation-deployment      2/2     2            2           
deployment.apps/reservation-database-deployment   2/2     2            2           
deployment.apps/reservation-socket-deployment     2/2     2            2           
deployment.apps/zookeeper-deployment-1            1/1     1            1           
deployment.apps/zookeeper-deployment-2            1/1     1            1           

NAME                                                         DESIRED   CURRENT   READY   
replicaset.apps/aws-s3-listing-deployment-64895d6868         2         2         2       
replicaset.apps/federated-flask-deployment-6d96d5d5f8        2         2         2       
replicaset.apps/kafka-deployment-1-f57fc5fbc                 1         1         1       
replicaset.apps/kafka-deployment-2-6f5769c7c5                1         1         1       
replicaset.apps/react-auth-deployment-6b84556ddf             2         2         2       
replicaset.apps/react-envoy-deployment-6556f5fd57            1         1         1       
replicaset.apps/react-frontend-deployment-8466d49c9          2         2         2       
replicaset.apps/react-listing-deployment-6fdccb46ff          2         2         2       
replicaset.apps/react-reservation-deployment-6bb674fd69      2         2         2       
replicaset.apps/reservation-database-deployment-7ff47c6cc5   2         2         2       
replicaset.apps/reservation-socket-deployment-6fd569cb79     2         2         2       
replicaset.apps/zookeeper-deployment-1-7989c6c445            1         1         1       
replicaset.apps/zookeeper-deployment-2-7989c6c445            1         1         1       

NAME                                                            REFERENCE                              TARGETS   MINPODS   MAXPODS   REPLICAS   
horizontalpodautoscaler.autoscaling/react-frontend-deployment   Deployment/react-frontend-deployment   21%/80%   2         8         2          
```

# Usage

1. Change your directory to the `docker-composer` folder:

```
cd docker-composer
```

2. Run the script `deploy.sh` to start *kubernetes*

```
./deploy.sh
```

## ARCHIVE
### UI setup

---

#### Prerequisites

- [npm/npx](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

#### React Setup

1. Change your current directory to the `react/` folder:

```
cd react
```

2. Install dependencies

```
npm install --save-dev @babel/plugin-proposal-private-property-in-object
```

3. Start React App

```
npm start
```

---

#### Auth microservice Setup

1. Change your current directory to the `auth/` folder:

```
cd auth
```

2. Install dependencies

```
npm install
```

3. Start Auth microservice

```
npm run start:dev
```

---

#### Django Setup

1. Change your current directory to the `django/` folder:

```
cd django
```

2. Setup virtual environment

```
virtualenv env
```

3. Activate virtual environment

| For Mac                      | For Windows                 |
| ---------------------------- | --------------------------- |
| ```source env/bin/activate```| ```.\env\Scripts\activate```|

4. Install dependencies

```
pip3 install -r requirements.txt
```

5. Setup database

```
python manage.py makemigrations
python manage.py migrate
```

6. Start Django App

```
python manage.py runserver
```

