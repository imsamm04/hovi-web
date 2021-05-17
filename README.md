# Hovi web

## Setup client web
- Install nodejs8.0.0 or above.
- Install Docker ([Docker for window](https://docs.docker.com/docker-for-windows/), [Docker for ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/))
- Install [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) (Google Chrome)

## Scripts
- `npm start`: Run client web app with local environment (Use for development).
- `npm build`: Build client web app into *build* folder.
- `npm test`: Run tests client web app.
- `npm run docker:dev`: Run client web app with docker environment (Use to development in docker).
- `npm run docker-prod:dev`: Run production web app in local.

## Branch naming
- Check out new branch from branch `develop`.
- Branch convention:
    - master: production release
    - develop: development
    - feature/task_key_words_YYYYMMDD_thuongnn
    - fixbug/task_key_words_YYYYMMDD_thuongnn
    
## Code structure convention
### `src/apis` folder
> Make the api call to the server to call and process data

##### How to use?
### `mock` folder
> It is agreed that all `.js` files in the mock directory will be parsed as mock files.

For example, create a new `mock/users.js` with the following contents:
```js
export default {
  '/api/users': {
      "id": 1,
      "userName": "admin",
      "fullName": "Nguyen Nhu Thuong",
      "phoneNumber": "0986352227",
      "email": "thuongnnse05095@fpt.edu.vn"
  },
};
```
Then visit http://localhost:8000/api/users in your browser to see:
```json
{
  "id": 1,
  "userName": "admin",
  "fullName": "Nguyen Nhu Thuong",
  "phoneNumber": "0986352227",
  "email": "thuongnnse05095@fpt.edu.vn"
}
```

### `src/assets` folder
> Store project resources such as: logo, images file (png, jpg, svg,…)

### `src/components` folder
> Contains all components of the page

### `src/layouts` folder
> Contains all layouts of the project

##### How it work?
The page components will be `props.children` wrapped with` BasicLayout`. [Detail here...](https://umijs.org/guide/router.html#global-layout)
```js
export default function(props) {
  return (
    <>
      <Header />
      { props.children }
      <Footer />
    </>
  );
}
```

### `src/pages` folder
> Contains all pages of the client web app such as: `loginPage`, `homePage`,...
##### How it work?
We use [umijs](https://umijs.org/) framework so all created pages will be automated. [Detail here...](https://umijs.org/guide/router.html#conventional-routing)

Assume that the pages directory structure is as follows:
```$xslt
+ pages/
  + users/
    - $id$.js
    - list.js
  - $id$.js
```
Then, umi will automatically generate the routing configuration as follows:
```$xslt
[
  { path: '/', component: './pages/$id$.js' },
  { path: '/users/', component: './pages/users/$id$.js' },
  { path: '/users/list', component: './pages/users/list.js' },
]
```

### `src/utils` folder
> All support functions will be defined here

### Use css in project
Create less file such as `index.less`
```less
// index.less
.header {
  text-align: center;
}
```
Import less file into component such as below code:
```js
// Header.js
import styles from './index.less';

export default function() {
  return (
    <div className={styles.header}>Header</div>
    )
}
```

### Use antd library in project
Import antd component need to use such as below:
```js
import {Button} from 'antd';

class ListCategory extends Component {
  render() {
    return (
      <div>
        <Button>Ok</Button>
      </div>
    )
  }
}
```
> Note: You need to read carefully and carefully the antd document [here](https://ant.design/docs/react/introduce) before starting the project.

# Reference
- [Ant Design](https://ant.design/)
- [UmiJS](https://umijs.org/)
