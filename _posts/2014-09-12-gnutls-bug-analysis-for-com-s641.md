---

layout: hebi-post
title: GnuTLS Bug Analysis for Com S641
location: Ames, IA
time: 04:31:15

---

# GnuTLS Bug Analysis

## Meta Information of the bug
`CVE-ID`: `CVE-2014-1959`

`CVE Link`: http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-1959

`NVD Link`: http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-1959

`Vulnerable Version`: before `3.1.21` and `3.2.x` before `3.2.11`

`Report Date`: `20140213`

`Reporter`: Nikos Mavrogiannopoulos in the Red Hat Security Technologies Team and GnuTLS project

`Victim`: All Linux

### What is it
`GnuTLS` is an open source library for `Transport Layer Security(TLS)`.
It is used in more than 200 different operating systems or applications
for implementing crucial SSL and TLS operations.

The GnuTLS Bug allows invalid certificates to pass validation check.
In particular, it causes the `x509 certificate` to be useless.
When user provide `x509 certificate`,
the code will pass it even if the certificate fails.

### Consequence

It affects ALL Linux. Hundreds of open source packages, including Red Hat, Ubuntu, Debian,
are under risk of being exploited by attackers.

Besides, web applications, email applications, and other codes that use this library
are vulnerable.

For instance, google’s Chrome Browser rely on GnuTLS library,
so if you use chrome under a vulnerable version of GnuTLS, you are on risk.

### Bug Report
Not applied.

### Reference
Critical crypto bug leaves Linux, hundreds of apps open to eavesdropping

by Dan Goodin

http://arstechnica.com/security/2014/03/critical-crypto-bug-leaves-linux-hundreds-of-apps-open-to-eavesdropping/

## Analysis
### Source Code
The bug lies in `lib/x509/verify.c`:

The original file is here: https://www.gitorious.org/gnutls/gnutls/source/1832e0be467d63c089cdebe3fb1158fc0be32e44:lib/x509/verify.c

```c
/* Checks if the issuer of a certificate is a
 * Certificate Authority, or if the certificate is the same
 * as the issuer (and therefore it doesn't need to be a CA).
 *
 * Returns true or false, if the issuer is a CA,
 * or not.
 */
static int
check_if_ca (gnutls_x509_crt_t cert, gnutls_x509_crt_t issuer,
unsigned int flags)
{
  int result;

  result =
    _gnutls_x509_get_signed_data (cert->cert, "tbsCertificate",
    &cert_signed_data);
  if (result < 0)
  {
    gnutls_assert ();
    goto cleanup;
  }
  result = 0;

  cleanup:
  // cleanup type stuff
  return result;
}
```

The function `check_if_ca` returns `true` or rather `1` when the certificate is a CA,
or `0` otherwise.
However, the other functions used return negative when they fail.

In `C` programming language, every value other than `0` is treated as `true`.
So, if the function `_gnutls_x509_get_signed_data` fails, the variable `result` is negative.
When the function `check_if_ca` returns, it returns a negative, which then be regarded as true.
That is to say, even if the certificate is invalid, it actually passes the CA check.
This function is used in `gnutls_x509_crt_verify` which verifies `x509 certificates`,
so invalid `x509 certificate` will pass the check.

### Codes that fixes this bug

```c
static int
check_if_ca (gnutls_x509_crt_t cert, gnutls_x509_crt_t issuer,
unsigned int flags)
{
  int result;
  result =
    _gnutls_x509_get_signed_data (issuer->cert, "tbsCertificate",
    &issuer_signed_data);
  if (result < 0)
  {
    gnutls_assert ();
    goto fail; // CHANGED
  }

  fail:  // ADDED
  result = 0;

  cleanup:
  // cleanup type stuff
  return result;
}
```
Now we see that in the bridged version,
when the function `_gnutls_x509_signed_data` fails,
the program goes to assignment for `result = 0`,
which ensures that the `check_if_ca` function returns `0`
to tell the caller that the certificate process fails.

So what causes the problem?
The confused part is that there are different agreement of how to judge a return state code.

In `C`, programmers often use `0` for success and `1` for fail as a tradition based on `Unix Tradition`.
GnuTLS used an **completely opposite solution**,
returning `1` for success and `0` for failure, and then *mixed* that with code that used the C traditional method.

### Lesson
Be sure to check if the return value is negative before returning it.
Hold a clear mind about what the return value means.

Actually one way to avoid this kind of issues is that
we use explicit error code to check the return value.
For example:

```c
#define RETURN_OK 1
#define RETURN_FAIL 0
#define RETURN_UNKNOWN 2
```

In this manner, we can make sure all the value is what we want.

What's more, instead of just checking two possibilities(true or false),
we can check as many choices as we want without any ambiguity.

###Tests that can trigger the bug

I’m not going to use the original GnuTLS implementation to test.
Instead, keeping this bug causes in mind, I wrote a simple c program with exactly the same issue.
Source codes come here:

```
#include<stdio.h>

#define CHECK_OK 1

int check(int candidate);
int do_check(int candidate);

int main() {
    int invalid = 3;
    if (check(invalid)) {
        printf("Pass\n");
    } else {
        printf("Fail\n");
    }
}

/*
 * return(Natural Way)
 *  true: pass
 *  0: fail
 */
int check(int candidate) {
    int result;
    result = do_check(candidate);
    if (result<0)
        goto fail;
    result = 0;
fail:
    return result;
}

/*
 * return(C Tradition)
 *  negative: fail
 *  0: pass
 */
int do_check(int candidate) {
    if (candidate == CHECK_OK) {
        return 0;
    } else {
        return -1;
    }
}
```

Here we have `check` function to check whether the candidate given is valid.
We define `CHECK_OK=1` as the correct state while we give `3` to the check function.

In main function, we give the result from `check` directly to if statement to judge `Pass` or `Fail`.
In the implementation of `check`, we do expect to return true for pass and `0` for fail.

However, in the low level implementation of check, the `do_check` function, the code follow the `Unix tradition`,
that is, return 0 for success, and negative for fail.

So, when the do_check function found a invalid certificate, it returns a negative.
But in `if` statement in `main` function, issue is caused because `C` treats negative as `true`.

When we compile the program and see the result, `Pass` is outputed even if we input an invalid certificate `3`.

### Further Analysis

Programmers always cannot remember what all return values mean.
Most good programmers will check if negative values bring some trouble.

For static analysis, this is flow sensitive for that it does make difference when to assign the result for return.
It is path sensitive analysis because for execution in different branches the assignment differs.
Besides, some statements are skipped in different executions.
