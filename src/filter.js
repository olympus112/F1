import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const marks = [
    {
      value: 0,
      label: '2017',
    },
    {
      value: 25,
      label: '2018',
    },
    {
      value: 50,
      label: '2019',    
    },
    {
      value: 100,
      label: '2021',
    },
  ];
  
//   const marks = [
//     {
//       value: 2018,
//       label: '2018',
//     },
//     {
//       value: 2019,
//       label: '2019',
//     },
//     {
//       value: 2020,
//       label: '2020',
//     },
//     {
//       value: 2021,
//       label: '2021',
//     },
//   ];

  function valuetext(value) {
    return `${value}`;
  }
  

export default function Filter(props){
    //javascript functies maak je hierboven
    //VB van hoe je code catched van de top component app


    
    return (
        <Box sx={{ width: 300 }}>
          <Slider
            aria-label="Restricted values"
            defaultValue={2021}
            getAriaValueText={valuetext}
            step={null}
            marks={marks}
          />
        </Box>
      );
    // );

    // return(
    //     <div>
    //         <p>Hier komt de filter component, dit is de doorgegeven gegevens: {props.info}</p>
    //         <p>The picked driver is: {props.outputinothercomponent}</p>
    //     </div>
    // )
}