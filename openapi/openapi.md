# radiod - A friendly web radio.



## Table of Contents

* [Servers](#servers)
* [Paths](#paths)
  - [`GET` /configuration](#op-get-configuration) 
  - [`DELETE` /media/delete/{credentialId}](#op-delete-media-delete-credentialid) 
  - [`GET` /media/find](#op-get-media-find) 
  - [`GET` /media/{serviceId}/callback](#op-get-media-serviceid-callback) 
  - [`GET` /now/find](#op-get-now-find) 
  - [`GET` /now/get](#op-get-now-get) 
  - [`POST` /now/set](#op-post-now-set) 
  - [`GET` /now/who](#op-get-now-who) 
  - [`GET` /ping](#op-get-ping) 
  - [`PUT` /song/add](#op-put-song-add) 
  - [`DELETE` /song/delete](#op-delete-song-delete) 
  - [`GET` /song/get](#op-get-song-get) 
  - [`GET` /song/is](#op-get-song-is) 
  - [`POST` /song/synchronize](#op-post-song-synchronize) 
  - [`POST` /user/login](#op-post-user-login) 
  - [`POST` /user/logout](#op-post-user-logout) 
  - [`GET` /user/me](#op-get-user-me) 
  - [`POST` /user/register](#op-post-user-register) 
  - [`GET` /user/{userId}](#op-get-user-userid) 
* [Schemas](#schemas)
  - [Configuration](#schema-configuration)
  - [MediaCredentials](#schema-mediacredentials)
  - [NowObject](#schema-nowobject)
  - [NowState](#schema-nowstate)
  - [User](#schema-user)
  - [Song](#schema-song)
  - [NewUser](#schema-newuser)
  - [LoginCredentials](#schema-logincredentials)


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


### `GET` /configuration
<a id="op-get-configuration" />









#### Responses


##### ▶ 200 - Return the client configuration

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>icecast_url <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>spotify_id <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>deezer_id <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "icecast_url": "string",
  "spotify_id": "string",
  "deezer_id": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `DELETE` /media/delete/{credentialId}
<a id="op-delete-media-delete-credentialid" />



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

### `GET` /media/find
<a id="op-get-media-find" />





#### Query parameters

##### &#9655; scope



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
        <td>scope </td>
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


##### ▶ 200 - Array of Credential model instances

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>Response</td>
        <td>
          array
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.id</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.userId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.type <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.token <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.identifier <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.name</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.scope</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
[
  {
    "id": "string",
    "userId": "string",
    "type": 0,
    "token": "string",
    "identifier": "string",
    "name": "string",
    "scope": "string"
  }
]
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /media/{serviceId}/callback
<a id="op-get-media-serviceid-callback" />



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


##### ▶ 204 - Add your credential to Radiod and redirect to /close

###### Headers
_No headers specified_


#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /now/find
<a id="op-get-now-find" />









#### Responses


##### ▶ 200 - Return an array of users with a Spotify account.

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>Response</td>
        <td>
          array
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.id</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.email <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.power <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.firstName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.lastName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.playlistId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
[
  {
    "id": "string",
    "email": "string",
    "power": 0,
    "firstName": "string",
    "lastName": "string",
    "playlistId": "string"
  }
]
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /now/get
<a id="op-get-now-get" />









#### Responses


##### ▶ 200 - Return informations about the current song

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>listeners <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>song <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>artists <strong>(required)</strong></td>
        <td>
          array(string)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>album</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>release_date</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>cover</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>url</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "type": 0,
  "listeners": 0,
  "song": "string",
  "artists": [
    "string"
  ],
  "album": "string",
  "release_date": "string",
  "cover": "string",
  "url": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `POST` /now/set
<a id="op-post-now-set" />







#### Request body
###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>name</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>userId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>song</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>artist</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>album</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>url</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "type": 0,
  "name": "string",
  "userId": "string",
  "song": "string",
  "artist": "string",
  "album": "string",
  "url": "string"
}
```




#### Responses


##### ▶ 204 - Set the default credential succeeed

###### Headers
_No headers specified_


#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /now/who
<a id="op-get-now-who" />









#### Responses


##### ▶ 200 - Return the current state of NowService

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>name</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>userId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>song</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>artist</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>album</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>url</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "type": 0,
  "name": "string",
  "userId": "string",
  "song": "string",
  "artist": "string",
  "album": "string",
  "url": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /ping
<a id="op-get-ping" />









#### Responses


##### ▶ 200 - Ping Response

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>greeting</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>date</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>url</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>headers</td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>headers.Content-Type</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "greeting": "string",
  "date": "string",
  "url": "string",
  "headers": {
    "Content-Type": "string"
  }
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `PUT` /song/add
<a id="op-put-song-add" />





#### Query parameters

##### &#9655; url



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
        <td>url </td>
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


##### ▶ 200 - Informations about the current song

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>id</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>title <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>album <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>artist <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>artwork <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>url <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>userId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "id": "string",
  "title": "string",
  "album": "string",
  "artist": "string",
  "artwork": "string",
  "url": "string",
  "userId": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `DELETE` /song/delete
<a id="op-delete-song-delete" />





#### Query parameters

##### &#9655; url



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
        <td>url </td>
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


##### ▶ 204 - The user's song is deleted with success

###### Headers
_No headers specified_


#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /song/get
<a id="op-get-song-get" />









#### Responses


##### ▶ 200 - Array of user's songs

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>Response</td>
        <td>
          array
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.id</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.title <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.album <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.artist <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.artwork <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.url <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>Response.userId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
[
  {
    "id": "string",
    "title": "string",
    "album": "string",
    "artist": "string",
    "artwork": "string",
    "url": "string",
    "userId": "string"
  }
]
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /song/is
<a id="op-get-song-is" />





#### Query parameters

##### &#9655; url



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
        <td>url </td>
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


##### ▶ 200 - Return true is this is an user's song, false otherwise.

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>Response</td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
true
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `POST` /song/synchronize
<a id="op-post-song-synchronize" />





#### Query parameters

##### &#9655; name



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
        <td>name </td>
        <td>
          string
        </td>
        <td>query</td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### &#9655; description



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
        <td>description </td>
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


##### ▶ 204 - The synchronization with Spotify is a success.

###### Headers
_No headers specified_


#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `POST` /user/login
<a id="op-post-user-login" />







#### Request body
###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>email <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>password <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "email": "string",
  "password": "string"
}
```




#### Responses


##### ▶ 204 - Grant token in a cookie

###### Headers
##### Set-Cookie



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>Set-Cookie</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>





#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `POST` /user/logout
<a id="op-post-user-logout" />









#### Responses


##### ▶ 204 - Revoke the token

###### Headers
##### Set-Cookie



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>Set-Cookie</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>





#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /user/me
<a id="op-get-user-me" />









#### Responses


##### ▶ 200 - The current user profile

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>id</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>email <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>power <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>firstName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>lastName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>playlistId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "id": "string",
  "email": "string",
  "power": 0,
  "firstName": "string",
  "lastName": "string",
  "playlistId": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `POST` /user/register
<a id="op-post-user-register" />







#### Request body
###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>email <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>password <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>firstName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>lastName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```




#### Responses


##### ▶ 200 - User

###### Headers
_No headers specified_

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>id</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>email <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>power <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>firstName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>lastName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>playlistId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "id": "string",
  "email": "string",
  "power": 0,
  "firstName": "string",
  "lastName": "string",
  "playlistId": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

### `GET` /user/{userId}
<a id="op-get-user-userid" />



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



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>id</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>email <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>power <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>firstName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>lastName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>playlistId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "id": "string",
  "email": "string",
  "power": 0,
  "firstName": "string",
  "lastName": "string",
  "playlistId": "string"
}
```

#### Tags

<div class="tags">
  <div class="tags__tag"></div>
</div>
</div>

## Schemas

<a id="schema-configuration" />

#### Configuration

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>icecast_url <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>spotify_id <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>deezer_id <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "icecast_url": "string",
  "spotify_id": "string",
  "deezer_id": "string"
}
```
<a id="schema-mediacredentials" />

#### MediaCredentials

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>id</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>userId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>type <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>token <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>identifier <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>name</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>scope</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "id": "string",
  "userId": "string",
  "type": 0,
  "token": "string",
  "identifier": "string",
  "name": "string",
  "scope": "string"
}
```
<a id="schema-nowobject" />

#### NowObject

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>listeners <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>song <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>artists <strong>(required)</strong></td>
        <td>
          array(string)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>album</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>release_date</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>cover</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>url</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "type": 0,
  "listeners": 0,
  "song": "string",
  "artists": [
    "string"
  ],
  "album": "string",
  "release_date": "string",
  "cover": "string",
  "url": "string"
}
```
<a id="schema-nowstate" />

#### NowState

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>name</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>userId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>song</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>artist</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>album</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>url</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "type": 0,
  "name": "string",
  "userId": "string",
  "song": "string",
  "artist": "string",
  "album": "string",
  "url": "string"
}
```
<a id="schema-user" />

#### User

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>id</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>email <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>power <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>firstName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>lastName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>playlistId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "id": "string",
  "email": "string",
  "power": 0,
  "firstName": "string",
  "lastName": "string",
  "playlistId": "string"
}
```
<a id="schema-song" />

#### Song

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>id</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>title <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>album <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>artist <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>artwork <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>url <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>userId</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "id": "string",
  "title": "string",
  "album": "string",
  "artist": "string",
  "artwork": "string",
  "url": "string",
  "userId": "string"
}
```
<a id="schema-newuser" />

#### NewUser

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>email <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>password <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>firstName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>lastName</td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```
<a id="schema-logincredentials" />

#### LoginCredentials

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>email <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>password <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "email": "string",
  "password": "string"
}
```
