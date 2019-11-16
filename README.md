# bebok
Bebok is a typescript library which simplifies the process of creating single page applications

# Uruchamianie
- `npm install`
- `npm run dev`

Pod adresem `localhost:8080` można zobaczyć działanie na przykładowym pliku `component.tsx`,
gdzie kod:

```
const containerStyle = `
    border: 5px black solid;
    background: #AFAFAF;
    font-family: sans-serif;
`;

const headerStyle = `
    color: #3F5F7F;
    font-size: 16px;
`;

const component = (
    <div style={containerStyle}>
        <h1 style={headerStyle}>
            BebokJS
        </h1>
        <div style='background: #FAFAFA; box-shadow: 3px 5px 0px 0px #999999; margin: 5px;'>
            Oto prosty test działania biblioteki
        </div>
    </div>
);
```

W przeglądarce zaprezentuje się tak:

<img src='https://i.imgur.com/P8FpodF.png' />
