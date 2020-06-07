# Google Input Search

Google Input Search is a location finder based on the google predictions search engine.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Google Input Search.

```bash
npm i google-input-search
```

Your required install Google types:

```bash
npm i -S -D @types/google-maps
```

In your index.html:

```html
<head>
    <!-- Add the API GOOGLE KEY-->
    <script src="MY_GOOGLE_API_KEY"></script>
</head>
```

## Usage

In your module:
```ts
import { NgModule } from '@angular/core';
import { GoogleInputSearchModule } from 'google-input-search';

@NgModule({
  imports: [
    GoogleInputSearchModule
  ]
})
export class MyModule { }
```

Input html file: 

```html
<lib-google-input-search></lib-google-input-search>
```

## Api Reference

### Google Search Input Component 

| Name                   | Type    | Description                                                                   |Default|
|------------------------|---------|-------------------------------------------------------------------------------|-------|
| hostClass              | @Input  | Whether the host class for this element is active                             | true                             |
| placeholder            | @Input  | Placeholder text for input                                                    | empty                            |
| debounceTime           | @Input  | Time debounce to search                                                       | 450ms                            |
| searchInput            | @Output | Channel to broadcast the input event of the search field                      | string                           |
| searchLoading          | @Output | Channel for charge status emission.                                           | boolean                          |
| searchResult           | @Output | Channel for broadcasting results found                                        | QueryAutocompletePrediction[]    |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Authors

* **José Silva** - *Initial work* - [jskcod4](https://github.com/joserozsil)

## License
[MIT](https://choosealicense.com/licenses/mit/)
