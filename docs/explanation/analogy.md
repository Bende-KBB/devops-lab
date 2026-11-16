# The Analogy: A Soup Company

One analogy for the whole project, defined once. Other docs refer to it instead of re-explaining.

**The world:** a soup company that cooks a recipe and sells the soup from food trucks. Each diagram shows the analogy first, the technology in brackets.

Planned phases are marked *(planned)*.

---

## Phase 1: Local server

A recipe, cooked in a home kitchen, served at your own table.

```mermaid
flowchart LR
    R["Recipe<br/>(server.js)"] --> K["Home kitchen<br/>(laptop + Node.js)"]
    K --> G["Guest at your own table<br/>(request to localhost)"]
```

---

## Phase 2: Public URL

You phone a courier company and keep the line open; they relay orders from anyone in the city down that line.

```mermaid
flowchart LR
    C["Customer in the city<br/>(visitor)"] -->|"calls a temporary number<br/>(random URL)"| CO["Courier company<br/>(Cloudflare)"]
    CO -->|"the line you opened<br/>(tunnel, outbound)"| K["Home kitchen<br/>(laptop)"]
```

- **The number changes on every call:** the random `trycloudflare.com` URL.
- **Nobody comes into the house:** the line was opened from inside (no router ports opened).

---

## Phase 3: Container

### Building the truck

```mermaid
flowchart LR
    P["Construction plan<br/>(Dockerfile)"] --> W["Workshop builds it<br/>(docker build)"]
    B["Standard slim truck model<br/>(base image)"] --> W
    R["Recipe<br/>(server.js)"] --> W
    W --> T["Sealed truck, serial number stamped<br/>from its contents<br/>(image, digest)"]
```

- **Build layers:** chassis, kitchen fit-out, soup station (image layers).
- **A sign at a parking spot, "today's soup truck",** which can be moved to a newer truck: a tag.

### Serving at an event

```mermaid
flowchart LR
    EP["Event plan<br/>(compose.yaml)"] --> T["Truck parked, serving<br/>(container)"]
    T --> D["Doorman passes on 'closing time!'<br/>(init)"]
    T --> WA["Waiter knocks every 10 s: 'still serving?'<br/>(health check)"]
    T --> S["Serving window to the street<br/>(published port)"]
```

- **Trucks on one site call each other by name** over a private service road: the project network.
- **The event plan isn't part of the truck:** the same truck can be parked under different plans.

---

## Phase 4: Continuous integration

### Tasting a proposed recipe change

```mermaid
flowchart LR
    PR["Cook hands in a change:<br/>'10% less salt'<br/>(pull request)"] --> PROC["Procedure: 'How to taste a<br/>proposed change'<br/>(ci.yml)"]
    PROC --> SES["Tasting session, file #12<br/>(workflow run)"]
    SES --> ST["Station in a rented kitchen,<br/>demolished afterwards<br/>(job on a runner)"]
    ST --> STAMP["Stamp 'TASTED ✔'<br/>(check)"]
```

- **One line on the station's sheet,** "Taste: is it salted and hot?": a step.
- **A courier hired to bring the recipe book,** booked by ID card number, not "whoever the agency sends": an action pinned by SHA.

### Into the recipe book, out to the depot

```mermaid
flowchart LR
    GATE["Gate: only stamped<br/>proposals pass<br/>(ruleset on main)"] --> BOOK["Recipe book entry<br/>(merge to main)"]
    BOOK --> SHIP["Procedure: 'How to send a truck<br/>to the depot'<br/>(publish-image.yml)"]
    SHIP --> GAR["Tasted truck sealed in this session's<br/>garage, scrapped after a day<br/>(artifact)"]
    GAR --> DISP["Dispatch station, holds the<br/>depot key<br/>(job with packages: write)"]
    DISP --> DEP["Central depot<br/>(GHCR)"]
```

---

## Phase 5: Production on the domain

```mermaid
flowchart LR
    C["Customer in the city"] -->|"calls the fixed number,<br/>listed in the directory<br/>(devops-pipe.live)"| CO["Courier company<br/>(Cloudflare)"]
    CO -->|"line opened by the courier,<br/>who shows his badge<br/>(named tunnel, token)"| T["Truck serving soup<br/>(app container)"]
```

- **The number never changes:** it's in the city's directory (DNS).
- **The badge:** whoever holds it can take the calls, so it stays locked away (`tunnel.env`, outside Git).
- **The street truck comes from the central depot, by serial number:** already tasted, never built in the owner's garage (the GHCR image by digest).

---

## Phase 6: Kubernetes and Helm *(planned)*

```mermaid
flowchart LR
    ORD["Order: 'always keep 2 soup<br/>trucks serving'<br/>(desired state)"] --> FM["Fleet manager<br/>(Kubernetes)"]
    FM --> LOT["Managed parking lot, its spaces<br/>(cluster, nodes)"]
    FM -->|"a truck breaks down"| NEW["Replaces it<br/>(self-healing)"]
    FORM["Fill-in-the-blanks event plan<br/>+ one values sheet<br/>(Helm chart, values.yaml)"] --> ORD
```

- **Shift change, one truck at a time,** so a soup truck is always serving: rolling update.

---

## Phase 7: Continuous deployment *(planned)*

```mermaid
flowchart LR
    BOOK["Official event plan<br/>in the recipe book<br/>(Git)"] --> DIS["Dispatcher compares<br/>book and street<br/>(Argo CD)"]
    STREET["Trucks on the street<br/>(cluster)"] --> DIS
    DIS -->|"fixes every difference"| STREET
```