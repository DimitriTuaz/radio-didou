# Radiod



## Table of Contents

* [Servers](#servers)
* [Paths](#paths)
  - [`GET` /now/delete/{credentialId}](#op-get-now-delete-credentialid) 
  - [`GET` /now/get](#op-get-now-get) 
  - [`GET` /now/set/{credentialId}](#op-get-now-set-credentialid) 
  - [`GET` /now/show](#op-get-now-show) 
  - [`GET` /now/{serviceId}/callback](#op-get-now-serviceid-callback) 
  - [`POST` /users/login](#op-post-users-login) 
  - [`POST` /users/logout](#op-post-users-logout) 
  - [`GET` /users/me](#op-get-users-me) 
  - [`POST` /users/register](#op-post-users-register) 
  - [`GET` /users/{userId}](#op-get-users-userid) 
* [Schemas](#schemas)
  - [NowCredentials](#schema-nowcredentials)
  - [User](#schema-user)
  - [NewUser](#schema-newuser)


<a id="servers" />
## Servers

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Description</th>
    <tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="/" target="_blank">/</a></td>
      <td></td>
    </tr>
  </tbody>
</table>

<a name="security"></a>
## Security

<table class="table">
  <thead class="table__head">
    <tr class="table__head__row">
      <th class="table__head__cell">Type</th>
      <th class="table__head__cell">In</th>
      <th class="table__head__cell">Name</th>
      <th class="table__head__cell">Scheme</th>
      <th class="table__head__cell">Format</th>
      <th class="table__head__cell">Description</th>
    </tr>
  </thead>
  <tbody class="table__body">
    <tr class="table__body__row">
      <td class="table__body__cell">apiKey</td>
      <td class="table__body__cell">cookie</td>
      <td class="table__body__cell">RADIO-DIDOU-AUTH</td>
      <td class="table__body__cell"></td>
      <td class="table__body__cell"></td>
      <td class="table__body__cell"></td>
    </tr>

  </tbody>
</table>

## Paths


### `GET` /now/delete/{credentialId}
<a id="op-get-now-delete-credentialid" />



#### Path parameters

##### &#9655; credentialId



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>In</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>credentialId  <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>path</td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>








#### Responses


##### ▶ 204 - Credential DELETE success

###### Headers
_No headers specified_


#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /now/get
<a id="op-get-now-get" />









#### Responses


##### ▶ 200 - Return value of NowController.getNow

###### Headers
_No headers specified_


#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /now/set/{credentialId}
<a id="op-get-now-set-credentialid" />



#### Path parameters

##### &#9655; credentialId



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>In</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>credentialId  <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>path</td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>








#### Responses


##### ▶ 200 - Return value of NowController.setNow

###### Headers
_No headers specified_


#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /now/show
<a id="op-get-now-show" />









#### Responses


##### ▶ 200 - Array of Credential model instances

###### Headers
_No headers specified_

###### application/json

##### Example _(generated)_

```json
[
  {
    "id": "string",
    "userId": "string",
    "name": "string",
    "type": 0,
    "token": "string"
  }
]
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /now/{serviceId}/callback
<a id="op-get-now-serviceid-callback" />



#### Path parameters

##### &#9655; serviceId



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>In</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>serviceId  <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>path</td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>




#### Query parameters

##### &#9655; code



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>In</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>code </td>
        <td>
          string
        </td>
        <td>query</td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>






#### Responses


##### ▶ 200 - Credential model instance

###### Headers
_No headers specified_

###### application/json

##### Example _(generated)_

```json
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "type": 0,
  "token": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `POST` /users/login
<a id="op-post-users-login" />







#### Request body
###### application/json

##### Example _(generated)_

```json
{
  "email": "user@example.com",
  "password": "string"
}
```




#### Responses


##### ▶ 204 - Grant token in a cookie

###### Headers
##### Set-Cookie




#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `POST` /users/logout
<a id="op-post-users-logout" />









#### Responses


##### ▶ 204 - Revoke the token

###### Headers
##### Set-Cookie




#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /users/me
<a id="op-get-users-me" />









#### Responses


##### ▶ 200 - The current user profile

###### Headers
_No headers specified_

###### application/json

##### Example _(generated)_

```json
{
  "id": "string",
  "email": "string",
  "name": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `POST` /users/register
<a id="op-post-users-register" />







#### Request body
###### application/json

##### Example _(generated)_

```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "password": "string"
}
```




#### Responses


##### ▶ 200 - User

###### Headers
_No headers specified_

###### application/json

##### Example _(generated)_

```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /users/{userId}
<a id="op-get-users-userid" />



#### Path parameters

##### &#9655; userId



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>In</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>userId  <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>path</td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>








#### Responses


##### ▶ 200 - User

###### Headers
_No headers specified_

###### application/json

##### Example _(generated)_

```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

## Schemas
