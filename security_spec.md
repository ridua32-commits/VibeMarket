# Security Specification - VibeMarket

## Data Invariants
1. A **Listing** must have a `status` in ['draft', 'pending', 'active', 'suspended'].
2. Only `active` listings are visible to the public. `draft` and `suspended` listings are only visible to the owner.
3. An **Order** must have a valid `listingId` and `buyerId`.
4. Users can only read their own private profiles. Public profiles (basic info) are visible to everyone.
5. All price fields must be non-negative.
6. `sellerId` in a listing must match the `request.auth.uid` of the creator.
7. `buyerId` in an order must match the `request.auth.uid` of the creator.
8. Timestamps (`createdAt`, `updatedAt`) must be set by the server.

## The "Dirty Dozen" Payloads
1. **Malicious Ownership**: Create a listing with `sellerId` belonging to another user.
2. **Shadow Field Injection**: Update a listing with an undocumented field `isApproved: true`.
3. **Status Skip**: Create a listing with `status: 'active'` directly (if policy requires 'pending' first, but here we allow 'active' for simplicity, let's say 'featured: true').
4. **Price Poisoning**: Create an order with `amount: -100`.
5. **ID Poisoning**: Create a listing with a 2MB string as document ID.
6. **Query Scraping**: Attempt to list all `draft` listings of other users.
7. **PII Leak**: Attempt to read the private `email` of another user.
8. **Orphaned Write**: Create an order for a listing that doesn't exist.
9. **Atomic Bypass**: Update order status to `completed` without a valid stripe session.
10. **Privilege Escalation**: Update own user role to `admin`.
11. **Timestamp Spoofing**: Provide a custom `createdAt` from the client.
12. **Immutable Violation**: Change the `sellerId` of an existing listing.

## Execution Plan
1. Define rigid validation helpers for each entity.
2. Implement Master Gate pattern for relational lookups.
3. Apply `affectedKeys().hasOnly()` gates to all updates.
4. Enforce strict `allow list` checks on `resource.data`.
