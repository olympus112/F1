import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const marks = [
    {
      value: 25,
      label: '2018',
    },
    {
      value: 0,
      label: '2017',
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
  
  function valuetext(value) {
    return `${value}`;
  }

  function findPercentage(min,max,val){
    return Math.round(100*(val-min)/(max-min));
    // min=2004     (min+max)/2 =2006     max = 2008
    // max-min = 4 = diff
    // value-min = rest
    // rest==0       rest==2              rest ==4
    // rest/diff=0   0.5                  1
    // *100
    // 0             50                   100
  }
  
export default function Filter(props){
    //javascript functies maak je hierboven
    //VB van hoe je code catched van de top component app
    console.log(props.years)
    console.log(props.years[0])  
    const marks = [];
    let min = props.years[0];
    let max = props.years[0];
    for (let i of props.years){
      if (i<min) {min = i;}
      if (i>max) {max = i;}
      console.log(i)
    }
    console.log(min);
    console.log(max);


    for (let i of props.years){
      console.log(findPercentage(min,max,i));
      console.log(valuetext(i));
      marks.push({value: findPercentage(min,max,i), label:i})
    }

    console.log(marks);
    
    return (
        <Box sx={{ width: 300 }}>
          <Slider
            aria-label="Restricted values"
            defaultValue={2021}
            getAriaValueText={valuetext}
            step={null}
            marks={marks}
            onChange={(event, newLabel) => {
                        for (let j of marks){
                          if (j['value'] == newLabel){
                            props.selectYear(j['label']);
                            console.log(j['label']);
                          }
                        }
                    }}
          />
        </Box>
      );
}