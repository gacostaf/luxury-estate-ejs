
# Security Audit Notes



## Moderate Vulnerabilities (Ignored - Safe)



### postcss <8.5.10 (GHSA-qx2v-qp2m-jg93)

- **Path**: next → postcss

- **Risk**: None - build-time only, no runtime exposure

- **Fix blocked**: Requires downgrading Next.js 15 → 9 (breaking)



### uuid <11.1.1 (GHSA-w5hq-g745-h8pq)  

- **Path**: next-auth → uuid

- **Risk**: None - no attacker-controlled buffer input in our usage

- **Fix blocked**: Requires downgrading next-auth (breaking)



## Review Schedule

- Re-run `npm audit` monthly

- Upgrade when Next.js/next-auth publish compatible patched versions

