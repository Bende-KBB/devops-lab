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

## Phase 6: Kubernetes and Helm

### The lot

```mermaid
flowchart LR
    PLAN["Plan of the lot:<br/>size, equipment<br/>(infra/local-cluster.yaml)"] -->|"built"| LOT["Managed parking lot,<br/>staff in the office, no trucks yet<br/>(cluster)"]
    LOT --- SP["Parking spaces<br/>(nodes)"]
    LOT --- OFF["Office: records, managers,<br/>dispatcher<br/>(control plane)"]
```

- **Closing the lot for the night** keeps every truck inside: stopping the cluster.
- **Demolishing the lot** removes it and every truck on it; the plan remains: deleting the cluster.
- **The office's key** opens everything: the kubeconfig, never handed out.
- **The phone to the office:** asking "which spaces exist?", ordering "park two soup trucks" (`kubectl`). The office only takes orders from someone showing the owner's ID card (the kubeconfig).
- **More parking spaces, one office:** two extra spaces where trucks can park, but no office of their own; the office in the first space runs the whole lot (agent nodes, server node). All spaces sit on one plot of land: if the plot floods, every space is gone.
- **An order form handed to the office:** "one soup truck, of this exact serial number" (a manifest, `kubectl apply`). The office picks a free space and has the truck fetched from the depot and parked there (scheduler, kubelet, pod).
- **A private corridor from the owner's desk to that truck:** for tasting, not for customers (`kubectl port-forward`).
- **The fleet manager,** told "always keep 2 soup trucks serving," sends a new truck the moment one leaves, without asking why (Deployment, ReplicaSet). Each truck carries the company's sticker, so the manager knows which trucks are his to count (labels, selector).

### Planned

- **Shift change, one truck at a time,** so one is always serving: rolling update.
- **Fill-in-the-blanks event plan + one values sheet:** Helm chart, `values.yaml`.

---

## Phase 7: Continuous deployment *(planned)*

```mermaid
flowchart LR
    BOOK["Official event plan<br/>in the recipe book<br/>(Git)"] --> DIS["Dispatcher compares<br/>book and street<br/>(Argo CD)"]
    STREET["Trucks on the street<br/>(cluster)"] --> DIS
    DIS -->|"fixes every difference"| STREET
```