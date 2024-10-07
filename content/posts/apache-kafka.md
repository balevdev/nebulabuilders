---
title: "Architectural Digest Episode I: Apache Kafka ❤"
date: 2024-03-12T09:00:00Z
draft: false
tags: ["Apache Kafka", "Distributed Systems", "Data Streaming", "Software Architecture"]
categories: ["Technology", "Big Data"]
---

## Why Kafka?

Apache Kafka has always been one of my favourite technologies up to date. So I'm biased towards promoting it. That being said, the technology is a piece of art that can be used for everything under the sun from simple broker usage to large scale streaming solutions. Apache Kafka stands as a monumental innovation, offering unparalleled solutions to the challenges of data processing and streaming at scale. It was developed by Jay Kreps, Neha Narkhede, and Jun Rao at LinkedIn in 2010 and transcended its initial use case to become an elite platform for real-time data streaming, processing, and more.

## The Start and Evolution of Apache Kafka

Apache Kafka was conceived out of necessity, born from LinkedIn's critical need to manage massive volumes of data with higher efficiency and reliability than traditional messaging systems allowed. It was designed to overcome the limitations of existing systems in scalability, data retention, and fault tolerance, which were pivotal for LinkedIn's burgeoning data processing requirements.

 -**Year of Creation**: 2010
- **Creators**: Jay Kreps, Neha Narkhede, Jun Rao
- **Primary Goal**: To build a distributed system capable of handling high volumes of data writes and reads, with built-in fault tolerance and scalability.

## Kafka Architecture - Core components (Kotlin ^_^ Examples)

![Kafka Architecture](https://kafka.apache.org/images/kafka-apis.png)
*Image Credit: https://kafka.apache.org/*

### Producer API
Allows applications to send streams of data to topics in the Kafka cluster.

```
+-----------------+      +-----------------+      +---------+
|      Application | ---- | Producer Library | ---- | Kafka   |
+-----------------+      +-----------------+      +---------+
                          ^ (Message)
                          |
```

Example: A web application receives real-time user activity data (clicks, purchases) and uses the Producer API to send this data to a Kafka topic named "user_activity"

```kotlin
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.support.SendResult
import org.springframework.stereotype.Service
import org.springframework.util.concurrent.ListenableFuture
import org.springframework.util.concurrent.ListenableFutureCallback

@Service
class ProducerService(private val kafkaTemplate: KafkaTemplate<String, String>) {

    fun sendMessage(topic: String, key: String, message: String) {
        val future: ListenableFuture<SendResult<String, String>> = kafkaTemplate.send(topic, key, message)

        future.addCallback(object : ListenableFutureCallback<SendResult<String, String>> {
            override fun onSuccess(result: SendResult<String, String>?) {
                println("Sent message=[$message] with offset=[${result?.recordMetadata?.offset()}]")
            }

            override fun onFailure(ex: Throwable) {
                println("Unable to send message=[$message] due to : ${ex.message}")
            }
        })
    }
}
```

**Explanation**: This is useful for decoupling the application from downstream processing. The application sends data without worrying about who consumes it or when. Kafka buffers the data, ensuring reliable delivery even if consumers are temporarily unavailable.

### Consumer API
Enables applications to read streams of data from topics.

```
+-----------------+      +-----------------+      +---------+
|      Application | ---- | Consumer Library | ---- | Kafka   |
+-----------------+      +-----------------+      +---------+
                                         ^ (Message)
                                         |
```

```kotlin
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.support.KafkaHeaders
import org.springframework.messaging.handler.annotation.Header
import org.springframework.stereotype.Service

@Service
class ConsumerService {

    @KafkaListener(topics = ["user_activity"], groupId = "test-group", concurrency = "3")
    fun listen(
        message: String,
        @Header(KafkaHeaders.RECEIVED_PARTITION_ID) partition: Int,
        @Header(KafkaHeaders.OFFSET) offset: Long
    ) {
        println("Received message: $message from partition: $partition at offset: $offset")
    }

    @KafkaListener(topics = ["user_activity"], groupId = "test-group-errors")
    fun errorListener(message: String) {
        println("Handling error for message: $message")
        /// HANDLE ERROR HERE 
    }
}
```

Example: A fraud detection system subscribes to the "user_activity" topic using the Consumer API. It reads incoming messages (user activity data) and analyzes them for suspicious patterns that might indicate fraudulent transactions.

**Explanation**: This is beneficial for real-time processing of data streams. The consumer application can react to incoming events as they occur, enabling immediate actions like fraud detection or triggering alerts.

### Streams API
Facilitates the building of applications that process input streams and produce output streams.

```
+-----------------+      +-----------------+      +---------+      +-----------------+
|      Application | ---- | Streams Library  | ---- | Kafka   | ---- |  Another Topic  |
+-----------------+      +-----------------+      +---------+      +-----------------+
                          ^ (Message)                             ^ (Processed Message)
                          |                                         |
```

```kotlin
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.state.Stores
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.EnableKafkaStreams

@Configuration
@EnableKafkaStreams
class StreamsConfig {

    @Bean
    fun kStream(builder: StreamsBuilder): KStream<String, String> {
        val kStream: KStream<String, String> = builder.stream("user_activity")

        val purchaseStream = kStream.filter { _, value -> value.contains("purchase") }
        purchaseStream.to("purchased_items", Produced.with(Serdes.String(), Serdes.String()))

        // Branching
        val branches = purchaseStream.branch(
            { _, value -> value.contains("high-value") },
            { _, _ -> true }
        )

        branches[0].to("high-value-purchases")
        branches[1].to("regular-purchases")

        // State store 
        val storeBuilder = Stores.keyValueStoreBuilder(
            Stores.persistentKeyValueStore("purchase-counts"),
            Serdes.String(),
            Serdes.Long()
        )
        builder.addStateStore(storeBuilder)

        return kStream
    }
}
```

We used KSQL principles: The platform can leverage KSQL, a stream processing SQL engine built on top of Kafka. KSQL allows you to write SQL-like queries to process and analyze data streams. Here's an example KSQL query achieving similar functionality:

```sql
CREATE STREAM user_activity (
  user_id INT,
  item_id INT,
  action STRING
) WITH (KAFKA_TOPIC='user_activity_topic', VALUE_FORMAT = 'JSON');

CREATE STREAM targeted_promotions (
  user_id INT,
  promotion_id INT
) WITH (KAFKA_TOPIC='targeted_promotions_topic', VALUE_FORMAT = 'JSON');

CREATE STREAM purchased_items AS
SELECT user_id,
  CASE 
    WHEN action = 'purchase' THEN item_id
    ELSE NULL
  END AS purchased_item
FROM user_activity
WHERE action = 'purchase'
GROUP BY user_id
EMIT CHANGES;

CREATE STREAM promotions_stream AS
SELECT user_id,
  CASE 
    WHEN purchased_item IN (1, 2, 3) THEN 1  -- Promotion for specific items
    ELSE 2  -- Default promotion
  END AS promotion_id
FROM purchased_items
EMIT CHANGES;
```

Example: A marketing automation platform subscribes to the "user_activity" topic and utilizes a Streams API library. It processes the user activity data in real-time to identify user segments and send targeted marketing messages to a new topic named "targeted_promotions."

**Explanation**: The Streams API is valuable for building applications that transform and enrich data streams. It allows you to perform complex operations on incoming data and potentially generate new data streams for further processing or consumption by other applications.

### Connect API
Supports reliable, scalable, and easy integration of Kafka with existing applications or data systems like databases and such.

```
+-----------------+      +-----------------+      +---------+      +-----------------+
| External System | ---- | Kafka Connect  | ---- | Kafka   |      |  Application  |
+-----------------+      +-----------------+      +---------+      +-----------------+
                          ^ (Data)                           ^ (Message)
                          |                                         |
```

```kotlin
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class ConnectService(@Autowired private val restTemplate: RestTemplate) {

    fun createConnector(connectorConfig: String) {
        val connectUrl = "http://localhost:8083/connectors"
        restTemplate.postForLocation(connectUrl, connectorConfig)
    }
}
```

Example: An e-commerce platform uses Kafka Connect to integrate with its legacy order management system. Kafka Connect reads order data from the system, converts it into Kafka messages, and sends it to a topic named "orders." An application then subscribes to this topic and processes the orders for fulfilment.

**Explanation**: The Connect API simplifies integration with various data sources. It acts as a bridge, allowing you to seamlessly connect Kafka with external systems and databases, making data readily available for real-time processing and analysis within the Kafka ecosystem.

## Key Features and Technologies

- **Distributed System Design**: Kafka runs as a cluster on one or more servers, supporting partitioning, replication, and fault tolerance.
- **Partitioning**: Splits data across multiple nodes, allowing for parallel processing and enhancing scalability and throughput.
- **Replication**: Ensures fault tolerance by duplicating data across multiple nodes, safeguarding against data loss.
- **Option 1 Cluster Management Recommended (Kraft)**: Leverages Apache Kafka's built-in KRaft protocol for managing cluster metadata, including nodes, topics, and partitions. More efficient than Zookeeper option.
- **Option 2 Cluster Management Legacy (ZooKeeper Integration)**: Utilizes Apache ZooKeeper for cluster management, maintaining metadata about nodes, topics, and partitions.

![Kafka Cluster Management](https://www.confluent.io/wp-content/uploads/kraft-arch-1024x673.png)
*Image Credit: https://www.confluent.io/*

## Advanced Kafka Capabilities

Beyond its basic architecture, Kafka incorporates advanced features that fortify its position as a critical tool for data-intensive applications.

**Challenge Addressed**: Prevents data duplication and loss during processing, ensuring each record is processed exactly once, despite failures.

**Implementation**: Combines idempotence and transactional writes across multiple partitions and topics.

## Kafka's Impact on Data-Driven Technologies

Apache Kafka's design and capabilities have made it a linchpin in modern data architectures, supporting a wide array of applications:

- **Real-Time Analytics**: Powers analytical systems that require low-latency processing of large data streams.
- **Event Sourcing**: Facilitates the storage of changes to the application state as a sequence of events.
- **Log Aggregation**: Collects and processes log and event data from multiple sources.
- **Stream Processing**: Enables complex processing jobs that involve filtering, aggregating, and transforming data streams.

## Conclusion

Apache Kafka represents a paradigm shift in how data is ingested, processed, and analyzed in real-time across distributed systems. Its architectural ingenuity, coupled with a comprehensive suite of APIs and features, addresses the critical needs of scalability, reliability, and fault tolerance. As data continues to grow in importance and scale, Kafka's role in enabling efficient, real-time data processing will undoubtedly expand, further cementing its status as an essential component of the technological ecosystem.
