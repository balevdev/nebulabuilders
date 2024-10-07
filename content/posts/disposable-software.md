---
title: "Writing Disposable Software: Hexagonal Architecture and DDD for Flexible Codebase"
date: 2024-03-10T09:00:00Z
draft: false
tags: ["Domain Driven Design", "Hexagonal Architecture", "Software Development", "Go"]
categories: ["Software Architecture"]
author: "Boyan Balev"
description: "Explore the concept of 'disposable software' using Hexagonal Architecture and Domain-Driven Design principles in Go to create flexible and maintainable codebases."
---

The article delves into the concept of "disposable software" — not in the sense of throwaway code, but rather in creating systems that are so flexible and well-structured that any part can be easily replaced or updated without disrupting the whole. We'll explore how combining Hexagonal Architecture with Domain-Driven Design (DDD) principles, particularly in the Go programming language, can lead to more maintainable and adaptable codebases.

## The Disposable Mindset: A First Principles Approach

To truly understand the concept of disposable software, let's start with first principles. What are the fundamental truths about software development that we can build upon?

- Change is inevitable: Requirements evolve, technologies advance, and business needs shift.
- Complexity increases over time: As systems grow, they tend to become more complex and interconnected.
- Understanding decreases over time: As teams change and time passes, the original context and reasoning behind decisions can be lost.
- The cost of change increases with time: The longer a system exists, the more expensive it becomes to modify.

Given these principles, how can we design software that remains flexible and adaptable over time? The answer lies in creating systems where components are:

- Loosely coupled: Changes in one part of the system don't ripple through to others.
- Highly cohesive: Related functionality is grouped together, making it easier to understand and modify.
- Well-encapsulated: Implementation details are hidden behind clear interfaces.
- Independently replaceable: Any component can be swapped out without affecting the rest of the system.

This is the essence of the disposable software mindset. It's not about creating software that is meant to be thrown away, but rather designing systems where any part can be easily replaced or updated as needs evolve.

## Hexagonal Architecture: The Foundation of Flexibility

Hexagonal Architecture, also known as Ports and Adapters, is a design pattern that provides a solid foundation for disposable software. Let's examine its core principles and how they contribute to flexibility:

```
           ┌─────────────────────────────────────────┐
           │              Application                │
           │                                         │
           │    ┌───────────────────────────────┐    │
           │    │          Domain Core          │    │
           │    │                               │    │
  ┌─────┐  │  ┌─┴───────┐               ┌───────┴─┐  │  ┌─────┐
  │     │  │  │         │ use           │         │  │  │     │
  │  U  │──┼──│  Ports  │◄──────────── ▶│  Ports  │──┼──│  D  │
  │  S  │  │  │         │               │         │  │  │  A  │
  │  E  │  │  └─┬───────┘               └───────┬─┘  │  │  T  │
  │  R  │  │    │                               │    │  │  A  │
  │     │  │    └───────────────────────────────┘    │  │  B  │
  │  I  │  │                                         │  │  A  │
  │  N  │  │            ┌───────────────┐            │  │  S  │
  │  T  │  │            │   Adapters    │            │  │  E  │
  │  E  │──┼────────────┤               ├────────────┼──│     │
  │  R  │  │            │               │            │  │     │
  │  F  │  │            └───────────────┘            │  │     │
  │  A  │  │                                         │  │     │
  │  C  │  └─────────────────────────────────────────┘  │     │
  │  E  │                                               │     │
  └─────┘                                               └─────┘
```

Key components of Hexagonal Architecture:

- Domain Core: This is where the essential business logic resides. It's independent of any external concerns.
- Ports: These are interfaces that define how the domain core interacts with the outside world. They act as contracts for both incoming (driving) and outgoing (driven) operations.
- Adapters: These are implementations of the ports that connect the domain core to specific technologies or external systems.
- Application: This layer orchestrates the use of the domain core to fulfill specific use cases.

This architecture promotes disposability by:

- Isolating the domain core: The core business logic is protected from changes in external systems or technologies.
- Defining clear interfaces: Ports provide a stable contract between the core and external concerns.
- Allowing easy replacement of adapters: External implementations can be swapped out without affecting the core logic.

Let's examine a practical implementation of this architecture:

```
golang-ddd/
├── cmd/
│   └── api/
│       └── main.go                 # Entry point of the application
├── internal/
│   ├── domain/                     # Domain Core
│   ├── application/                # Use Cases
│   ├── infrastructure/             # Adapters (Driven)
│   └── interfaces/                 # Adapters (Driving)
├── pkg/
├── config/
├── migrations/
├── scripts/
├── tests/
├── api/
└── deployments/
```

This structure clearly separates the different layers of the Hexagonal Architecture, making it easier to navigate and maintain the codebase.

## Domain-Driven Design: Encapsulating Business Logic

Domain-Driven Design (DDD) complements Hexagonal Architecture by providing patterns for structuring the domain core. Let's delve deeper into how DDD principles contribute to disposable software:

```
internal/
└── domain/
    ├── user/
    │   ├── entity.go       # User aggregate root
    │   ├── value_objects.go # User-related value objects
    │   ├── repository.go   # Repository interface (Port)
    │   └── service.go      # Domain service
    ├── product/
    │   ├── entity.go
    │   ├── value_objects.go
    │   ├── repository.go
    │   └── service.go
    └── order/
        ├── entity.go
        ├── value_objects.go
        ├── repository.go
        └── service.go
```

Key DDD concepts and their role in disposable software:

1. Ubiquitous Language: By using a shared language between developers and domain experts, we reduce misunderstandings and make the code more aligned with business needs. This makes it easier to adapt the software as business requirements change.

2. Bounded Contexts: These define the boundaries within which a particular model is defined and applicable. They allow different parts of a large system to evolve independently.

```
    ┌─────────────────┐      ┌─────────────────┐
    │   User Context  │      │ Product Context │
    │                 │      │                 │
    │ ┌─────────────┐ │      │ ┌─────────────┐ │
    │ │    User     │ │      │ │   Product   │ │
    │ │  Aggregate  │ │      │ │  Aggregate  │ │
    │ └─────────────┘ │      │ └─────────────┘ │
    │                 │      │                 │
    └─────────────────┘      └─────────────────┘
            │                        │
            │                        │
            ▼                        ▼
    ┌─────────────────────────────────────┐
    │          Order Context              │
    │                                     │
    │ ┌─────────────┐    ┌─────────────┐  │
    │ │    Order    │    │  Order Line │  │ 
    │ │  Aggregate  │◄───│    Item     │  │
    │ └─────────────┘    └─────────────┘  │
    │                                     │
    └─────────────────────────────────────┘
```

3. Aggregates: These clusters of domain objects are treated as a single unit. They help maintain consistency and encapsulate complex relationships, making it easier to evolve the domain model.

4. Entities and Value Objects: Entities have a distinct identity that runs through time and different representations. Value Objects are immutable and defined only by their attributes. This distinction helps in designing more precise and maintainable domain models.

```go
// Entity
type User struct {
    ID   string
    Name string
    // ...
}

// Value Object
type Address struct {
    Street  string
    City    string
    Country string
}

func NewAddress(street, city, country string) Address {
    return Address{street, city, country}
}
```

5. Domain Services: These encapsulate domain logic that doesn't naturally fit within a single entity or value object. They help keep individual domain objects focused and cohesive.

```go
type OrderService interface {
    PlaceOrder(user User, items []OrderItem) (Order, error)
    CancelOrder(orderID string) error
}
```

By structuring our domain layer according to these DDD principles, we create a rich, expressive model of our business domain that is resilient to changes in external systems or application requirements.

## Encapsulation Over DRY: A New Perspective

While the Don't Repeat Yourself (DRY) principle is valuable, an over-zealous application can lead to tight coupling and brittleness. In our disposable architecture, we prioritize encapsulation over DRY. Let's explore this concept further:

```
Traditional Approach                Encapsulation-First Approach
┌───────────────────────┐            ┌───────────────────────┐
│    Shared Module      │            │    User Context       │
│ ┌───────────────────┐ │            │ ┌───────────────────┐ │
│ │  Validation Logic │ │            │ │  User Validation  │ │
│ └───────────────────┘ │            │ └───────────────────┘ │
└───────────────────────┘            └───────────────────────┘
          ▲   ▲                                 
          │   │                      ┌───────────────────────┐
          │   │                      │   Product Context     │
┌─────────┴───┴─────────┐            │ ┌───────────────────┐ │
│ User     │  Product   │            │ │Product Validation │ │
│ Module   │  Module    │            │ └───────────────────┘ │
└───────────────────────┘            └───────────────────────┘
```

In the traditional approach, we might create a shared validation module to avoid repeating validation logic. However, this can lead to:

- Tight coupling: Changes in one area might affect others unexpectedly.
- Reduced cohesion: The shared module might accumulate unrelated functionalities over time.
- Increased complexity: As the shared module grows, it becomes harder to understand and maintain.

In contrast, the encapsulation-first approach:

- Keeps Bounded Contexts: Related functionality stays together, even if it means some duplication between contexts.
- Improves understanding: Each context is self-contained and easier to reason about.
- Facilitates change: Changes in one context don't affect others, making the system more adaptable.

This approach is evident in our application layer structure:

```
internal/
└── application/
    ├── user/
    │   ├── commands/
    │   │   ├── create_user.go
    │   │   └── update_user.go
    │   └── queries/
    │       ├── get_user.go
    │       └── list_users.go
    ├── product/
    │   ├── commands/
    │   └── queries/
    └── order/
        ├── commands/
        └── queries/
```

Each use case (command or query) is encapsulated, allowing for:

- Clear interfaces: Each use case has a well-defined input and output.
- Independent evolution: Use cases can be modified or replaced without affecting others.
- Simplified testing: Each use case can be tested in isolation.

## Structuring for Change: A Deeper Dive

To make our software truly disposable, we need to structure it in a way that anticipates and facilitates change. Let's explore some key strategies in more depth:

### 1. Use Case Driven Design

By organizing our application layer around use cases rather than entities, we make it easier to add, remove, or modify functionality without affecting the entire system.

```
┌─────────────────────────────────────────────────────┐
│                   Application Layer                 │
│                                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐│
│  │ Create User │   │ Update User │   │  Get User   ││
│  │   Command   │   │   Command   │   │    Query    ││
│  └─────────────┘   └─────────────┘   └─────────────┘│
│                                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐│
│  │Create Order │   │ Cancel Order│   │ List Orders ││
│  │   Command   │   │   Command   │   │    Query    ││
│  └─────────────┘   └─────────────┘   └─────────────┘│
│                                                     │
└─────────────────────────────────────────────────────┘
```

Each use case is a self-contained unit that:

- Has a clear, single responsibility
- Defines its own input/output structures
- Encapsulates its own business logic

This approach allows us to:

- Add new features by adding new use cases
- Modify existing features by changing specific use cases
- Remove features by removing use cases

All without affecting other parts of the system.

### 2. Dependency Injection

Dependency Injection is a powerful technique for creating loosely coupled systems. It allows us to:

- Swap out implementations easily
- Improve testability by allowing mock injections
- Reduce direct dependencies between components

Here's how it might look in our infrastructure layer:

```go
// Port (defined in the domain layer)
type UserRepository interface {
    Save(user *User) error
    FindByID(id string) (*User, error)
}

// Adapter (in the infrastructure layer)
type PostgresUserRepository struct {
    db *sql.DB
}

func NewPostgresUserRepository(db *sql.DB) *PostgresUserRepository {
    return &PostgresUserRepository{db: db}
}

func (r *PostgresUserRepository) Save(user *User) error {
    // Implementation
}

func (r *PostgresUserRepository) FindByID(id string) (*User, error) {
    // Implementation
}

// In the application layer
type CreateUserUseCase struct {
    userRepo UserRepository
}

func NewCreateUserUseCase(repo UserRepository) *CreateUserUseCase {
    return &CreateUserUseCase{userRepo: repo}
}

func (uc *CreateUserUseCase) Execute(userData UserData) error {
    // Use uc.userRepo to create user
}
```

This structure allows us to easily swap out the PostgresUserRepository for a different implementation (e.g., MongoUserRepository) without changing the CreateUserUseCase.

### 3. Feature Flags

Feature flags allow us to enable or disable functionality without changing code. This can be particularly useful for:

- A/B testing
- Gradual rollouts
- Quick rollbacks in case of issues

Here's a simple implementation:

```
interfaces/
└── http/
    ├── v1/
    │   └── handlers/
    │       ├── user_handler.go
    │       └── product_handler.go
    └── v2/
        └── handlers/
            ├── user_handler.go
            └── product_handler.go
```

```go
func SetupRoutes(r *mux.Router) {
    v1 := r.PathPrefix("/api/v1").Subrouter()
    v1.HandleFunc("/users", v1handlers.CreateUser).Methods("POST")
    v1.HandleFunc("/products", v1handlers.ListProducts).Methods("GET")

    v2 := r.PathPrefix("/api/v2").Subrouter()
    v2.HandleFunc("/users", v2handlers.CreateUser).Methods("POST")
    v2.HandleFunc("/products", v2handlers.ListProducts).Methods("GET")
}
```

This structure allows us to:

- Introduce breaking changes in new versions without affecting existing clients
- Gradually migrate clients to new API versions
- Maintain multiple API versions simultaneously if needed

```
Client A           Client B           Client C
     │                  │                  │
     │    ┌─────────────┴──────┐           │
     │    │                    │           │
     ▼    ▼                    ▼           ▼
  ┌─────────────┐         ┌─────────────┐
  │   API v1    │         │   API v2    │
  └─────────────┘         └─────────────┘
         │                       │
         └───────────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Application    │
            └─────────────────┘
```

## Go's Role in Disposable Architecture

Go's language features and design philosophy align well with the principles of disposable software. Let's explore how Go supports our architectural goals:

### 1. Interfaces for Loose Coupling

Go's implicit interface implementation is a powerful tool for creating loosely coupled systems. It allows us to define contracts without creating dependencies between packages.

```go
// In the domain package
type UserRepository interface {
    Save(user *User) error
    FindByID(id string) (*User, error)
}

// In the infrastructure package
type PostgresUserRepository struct {
    db *sql.DB
}

func (r *PostgresUserRepository) Save(user *User) error {
    // Implementation
}

func (r *PostgresUserRepository) FindByID(id string) (*User, error) {
    // Implementation
}
```

The PostgresUserRepository implicitly implements the UserRepository interface without any explicit declaration. This makes it easy to swap implementations and promotes the dependency inversion principle.

### 2. Goroutines and Channels for Concurrency

Go's concurrency model, based on goroutines and channels, allows us to create scalable, responsive systems that can be easily modified or replaced.

```go
type OrderProcessor struct {
    input  chan Order
    output chan ProcessedOrder
}

func (op *OrderProcessor) Start(workerCount int) {
    for i := 0; i < workerCount; i++ {
        go op.worker()
    }
}

func (op *OrderProcessor) worker() {
    for order := range op.input {
        // Process order
        processedOrder := process(order)
        op.output <- processedOrder
    }
}
```

This design allows us to:

- Easily scale by adjusting the number of workers
- Replace the processing logic without changing the concurrency model
- Isolate the concurrency concerns from the business logic

### 3. Reflection for Dynamic Systems

While not always necessary, Go's reflection capabilities can be useful for creating more dynamic, adaptable systems. For example, we can use reflection to implement a generic repository:

```go
type GenericRepository struct {
    db *sql.DB
}

func (r *GenericRepository) Save(entity interface{}) error {
    val := reflect.ValueOf(entity)
    typ := val.Type()
    fields := make([]string, val.NumField())
    values := make([]interface{}, val.NumField())
    for i := 0; i < val.NumField(); i++ {
        fields[i] = typ.Field(i).Name
        values[i] = val.Field(i).Interface()
    }
    query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)",
        typ.Name(),
        strings.Join(fields, ", "),
        strings.Repeat("?, ", len(fields)-1)+"?")
    _, err := r.db.Exec(query, values...)
    return err
}
```

## Practical Implementation: Putting It All Together

Let's revisit our project structure and see how all these concepts come together:

```
golang-ddd/
├── cmd/
│   └── api/
│       └── main.go                 # Entry point, sets up DI, feature flags
├── internal/
│   ├── domain/                     # Domain models, repository interfaces
│   ├── application/                # Use cases, application services
│   ├── infrastructure/             # Repository implementations, external services
│   └── interfaces/                 # HTTP handlers, middleware
├── pkg/                            # Shared utilities
├── config/                         # Configuration management
├── migrations/                     # Database migration scripts
├── scripts/                        # Utility scripts (e.g., seeding data)
├── tests/                          # Integration and end-to-end tests
├── api/                            # API documentation (e.g., OpenAPI/Swagger)
└── deployments/                    # Deployment configurations
```

This structure embodies the principles of disposable software:

- Clear Separation of Concerns: Each layer has a distinct responsibility, making it easier to understand and modify.
- Encapsulation: Business logic is encapsulated in the domain and application layers, protected from external changes.
- Flexibility: The use of interfaces and dependency injection allows for easy replacement of components.
- Scalability: The structure supports adding new features or modifying existing ones without affecting the entire system.

## Conclusion: Embracing Change

Writing disposable software is about creating systems that are resilient to change. By combining Hexagonal Architecture with DDD principles and leveraging Go's language features, we can create codebases that are easy to understand, maintain, and evolve.

Key takeaways:

- Design for change: Anticipate and plan for future modifications.
- Embrace modularity: Keep components cohesive and loosely coupled.
- Focus on the domain: Encapsulate business logic within a rich domain model.
- Leverage Go's strengths: Utilize the language's features to promote simplicity and efficiency.
- Maintain clear boundaries: Use layers and interfaces to isolate concerns and dependencies.

Remember, the goal is not to create throwaway code, but rather to build systems where any part can be easily replaced or updated as needs change. This approach leads to more sustainable, adaptable software that can withstand the test of time and changing requirements.

By integrating these principles into your development process, you not only enhance the quality and longevity of your software but also make life easier for developers who maintain and evolve the system over time. Embrace the disposable mindset, and watch your software architecture become more flexible, maintainable, and ready for whatever the future holds. 