Use below when you want to reload the kubernetes
```
docker_composer/single_deploy.sh  <folder name>
```
E.g 
./single_deply.sh ../react-frontend-service/

Use below to build all images and push to repo
```
docker_composer/build.sh
```

Use below to deploy all pods and services
```
docker_composer/deploy.sh
```

As i deploy all to a different namespace, use below to change name space
```
kubectl config set-context --current --namespace=food-flow
```

If you want to clean up everything, just delete the namespace
```
kubectl delete namespace food-flow
```

If you were on minikube, remember to change back to docker-desktop or something
```
kubectl config use-context docker-desktop
```

To view contexts
```
kubectl config get-contexts
```
