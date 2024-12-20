---
title: "Kubernetes 101: Intro to the Best Orchestrator in the World"
date: 2024-03-11T10:00:00Z
draft: false
tags: ["Kubernetes", "Container Orchestration", "DevOps", "Cloud Native"]
categories: ["Technology", "Cloud Computing"]
image: "/images/Kubernetes.webp"
---

Kubernetes solves several critical problems in modern software development, particularly in managing containerized applications. As applications grow in complexity, managing these containers manually becomes untenable. Kubernetes offers a solution by providing automated orchestration, ensuring applications run efficiently and reliably across clusters of servers.

## A Brief History Lesson

Kubernetes, often abbreviated as K8s, has its roots in Google. Google's extensive experience in running large-scale containerized applications led to the development of an internal project called Borg. Borg was designed to manage the thousands of containers running in Google's vast data centers. Over time, Google recognized the potential benefits of open-sourcing a similar system to the broader community.

In 2014, Kubernetes was born out of this effort. It was released as an open-source project, allowing developers worldwide to benefit from Google's experience in container orchestration. Kubernetes quickly gained traction and has since become the de facto standard for container orchestration.

An interesting milestone in the history of Kubernetes was its role in supporting the massive success of Pokémon GO in 2016. The augmented reality game saw an unprecedented surge in users, leading to a need for a highly scalable and resilient infrastructure. Niantic, the company behind Pokémon GO, relied on Google Cloud Platform and Kubernetes to handle the explosive growth. Kubernetes' ability to manage and scale containerized applications efficiently was instrumental in ensuring the game's stability and performance during its peak popularity.

## What Problems Does Kubernetes Solve?

1. **Scalability**: Automatically scaling applications based on demand, ensuring efficient use of resources.
2. **Resource Management**: Optimizing hardware usage without over-provisioning or under-utilizing resources.
3. **High Availability**: Maintaining application availability despite hardware or software failures.
4. **Load Balancing**: Distributing network traffic effectively across multiple instances of an application.
5. **Rolling Updates and Rollbacks**: Updating applications without downtime and rolling back if issues occur.

## How Kubernetes Solves These Problems

Kubernetes introduces several key concepts and components to manage and orchestrate containers at scale:

1. **Declarative Configuration**: Kubernetes uses a declarative approach where you specify the desired state of your application using YAML or JSON files. Kubernetes then works to maintain this state.
2. **Self-Healing**: Kubernetes automatically restarts containers that fail, replaces containers, kills containers that don't respond to user-defined health checks, and doesn't advertise them to clients until they are ready to serve.
3. **Service Discovery and Load Balancing**: Kubernetes can expose a container using a DNS name or their own IP address. If traffic to a container is high, Kubernetes can load balance and distribute the network traffic so that the deployment is stable.

## Understanding Kubernetes Architecture

Kubernetes follows a master-worker architecture:

- **Master Node**: Manages the Kubernetes cluster, responsible for maintaining the desired state of the cluster.
- **Worker Nodes**: Run the application containers. Each worker node has a Kubelet (agent) that communicates with the master node.

### Understanding the Kubernetes Control Plane

In a Kubernetes cluster, the control plane is responsible for managing the overall state of the cluster, ensuring that the desired state of the system matches the actual state. The control plane includes several key components:

1. **etcd**: A highly available key-value store used as Kubernetes' backing store for all cluster data.
2. **kube-apiserver**: The API server is the frontend for the Kubernetes control plane.
3. **kube-scheduler**: Responsible for assigning Pods to nodes.
4. **kube-controller-manager**: Runs controller processes to regulate the state of the cluster.
5. **cloud-controller-manager**: Manages controller processes that interact with the underlying cloud provider.

## Key Components of Kubernetes

1. **Pod**: The smallest deployable unit in Kubernetes, encapsulating one or more containers.
2. **Service**: An abstraction that defines a logical set of Pods and a policy to access them.
3. **Deployment**: Manages the deployment of Pods, ensuring the desired number of replicas are running.
4. **ConfigMap and Secret**: Manage configuration data and sensitive information, respectively.
5. **Ingress**: Manages external access to services, typically HTTP.
6. **DaemonSet**: Ensures that a copy of a Pod runs on all (or some) nodes.
7. **StatefulSet**: Manages the deployment of stateful applications.
8. **Operator**: Custom controllers that extend Kubernetes capabilities.

## Getting Started with k3d

k3d is a lightweight Kubernetes distribution built for running K3s clusters in Docker. Here's how to get started:

1. Install k3d:
   ```bash
   curl -s https://raw.githubusercontent.com/rancher/k3d/main/install.sh | bash
   ```

2. Create a cluster:
   ```bash
   k3d cluster create mycluster
   ```

3. Install kubectl:
   ```bash
   curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
   chmod +x ./kubectl
   sudo mv ./kubectl /usr/local/bin/kubectl
   ```

4. Verify the cluster status:
   ```bash
   kubectl cluster-info
   ```

## Deploying Applications

### Creating a Deployment

Here's an example of deploying a simple Nginx application:

```yaml
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

Apply the deployment:
```bash
kubectl apply -f nginx-deployment.yaml
```

### Exposing the Deployment

Create a Service to expose the Nginx application:

```yaml
# nginx-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

Apply the service:
```bash
kubectl apply -f nginx-service.yaml
```

### Configuring Ingress

Set up an Ingress to manage external access:

```yaml
# nginx-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
spec:
  rules:
  - host: nginx.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
```

Apply the Ingress:
```bash
kubectl apply -f nginx-ingress.yaml
```

## Using ConfigMaps and Secrets

### ConfigMap Example

```yaml
# example-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-config
data:
  key1: value1
  key2: value2
```

### Secret Example

```yaml
# example-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: example-secret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

## Advanced Kubernetes Concepts

### DaemonSet Example

```yaml
# fluentd-daemonset.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      containers:
      - name: fluentd
        image: fluent/fluentd:v1.11-debian-1
```

### StatefulSet Example: PostgreSQL

```yaml
# postgres-statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: "postgres"
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
```

## Helm and Kustomize for IaC

Helm and Kustomize are powerful tools for managing Kubernetes configurations.

### Helm

Install Helm:
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Use Helm to deploy an application:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-release bitnami/nginx
```

### Kustomize

Example `kustomization.yaml`:
```yaml
resources:
- deployment.yaml
patchesStrategicMerge:
- patch.yaml
```

Build and apply with Kustomize:
```bash
kubectl kustomize . | kubectl apply -f -
```

## Installing NGINX Ingress Controller

Add the Helm repository for NGINX:
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

Install the NGINX Ingress controller:
```bash
helm install nginx-ingress ingress-nginx/ingress-nginx --namespace kube-system
```

## Why Kubernetes is Complex and How to Approach It

Kubernetes' complexity arises from its flexibility and the vast ecosystem it supports. Here are some tips for approaching Kubernetes:

1. Start Small
2. Understand the Basics
3. Use Documentation
4. Join the Community
5. Think Declaratively

## Real-World Use Cases

1. E-commerce Application
2. Continuous Integration/Continuous Deployment (CI/CD)
3. Machine Learning
4. Financial Services

## Conclusion

Kubernetes is a powerful tool that addresses many challenges of modern software deployment. By automating the deployment, scaling, and operations of containers, it enables developers to focus on building applications rather than managing infrastructure. With tools like k3d, Helm, and Kustomize, getting started with Kubernetes has never been easier.
