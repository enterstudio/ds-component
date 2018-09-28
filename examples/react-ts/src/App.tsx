import * as dscc from '@google/dscc';
import * as React from 'react';

const Message = (message: dscc.Message) => {
  const indexed = dscc.fieldsById(message);
  return (
    <table>
      <thead>
        <tr>
          {message.dataResponse.tables[0].fields.map((field, idx) => (
            <td key={`heading-${idx}`}>{indexed[field].name}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {message.dataResponse.tables[0].rows.map((row, idx) => (
          <tr key={`tableRow-${idx}`}>
            {row.map((rowEntry, innerIdx) => (
              <td key={`tableRow-${idx}-value-${innerIdx}`}>{rowEntry}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface State {
  message?: dscc.Message;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {message: undefined};
  }

  public componentDidMount() {
    const reactThis = this;
    dscc.subscribeToData((message) => {
      reactThis.setState({message});
    });
  }

  public render() {
    console.log(this.state.message);
    if (this.state.message === undefined) {
      return (
        <div>
          <h1>Waiting for Data Studio</h1>
        </div>
      );
    } else {
      return (
        <div>
          <Message {...this.state.message} />
        </div>
      );
    }
  }
}

export default App;

// setTimeout(() => {
//   const message: dscc.Message = {
//     config: {
//       data: {
//         elements: [{
//           id: 'hi',
//           label: 'hi',
//           options: {
//             max: 1,
//             min: 1,
//           },
//           type: dscc.ConfigDataElementType.DIMENSION,
//           values: [],
//         }],
//         id: "hi",
//         label: "hi",
//       },
//       style: {
//         elements: [],
//         id: 'hi',
//         label: 'hi',
//       },
//       themeStyle: undefined
//     },
//     dataResponse: {
//       tables: [
//         {
//           fields: ['field1', 'field2'],
//           rows: [
//             ['matt', 1],
//             ['yulan', 3],
//             ['minhaz', 5],
//           ],
//           type: dscc.TableType.DEFAULT,
//         }
//       ]
//     },
//     fields: [{
//       description: 'A person\'s name.',
//       id: 'field1',
//       name: 'Name',
//       type: dscc.FieldType.TEXT,
//     },
// {
//       description: 'A person\'s favorite number.',
//       id: 'field2',
//       name: 'Favorite Number',
//       type: dscc.FieldType.NUMBER,
//     }
//   ],
//     type: dscc.MessageType.RENDER,
//   };
//   window.parent.postMessage(message, '*');
// }, 1000)
