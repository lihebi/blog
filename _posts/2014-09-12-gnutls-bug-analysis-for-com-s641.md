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

GnuTLS bug causes the `x509 certificate` to be useless.
When user provide `x509 certificate`,
the code will pass it even if the certificate fails.

### Consequence

Hundreds of open source packages, including Red Hat, Ubuntu, Debian,
are under risk of being exploited by attackers.

Besides, web applications, email applications, and other codes that use this library
are vulnerable.

### Bug Report
Not applied.

## Analysis
### Source Code
The bug lies in `lib/x509/verify.c`:

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
This function is used in gnutls_x509_crt_verify which verifies x509 certificates,
so invalid x509 certificate will pass the check.

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
1. In `C`, programmers use `0` for success and `1` for fail.
However, `C` will treat negative as `true`, so negative means success too.
2. In `Unix`, the shell always treats `0` as `true`, and none-zero as false.
GnuTLS used a third option, which is the opposite of the first one,
returning `1` for success and `0` for failure, and then mixed that with code that used the C traditional method.

### Lesson
Be sure to check if the return value is negative before returning it.
Hold a clear mind about what the return value means.
Actually one way to avoid this kind of issues is that
we use state code to check the return value.
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

