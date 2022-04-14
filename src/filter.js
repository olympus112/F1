export default function Filter(props){
    //javascript functies maak je hierboven
    //VB van hoe je code catched van de top component app
    return(
        <div>
            <p>Hier komt de filter component, dit is de doorgegeven gegevens: {props.info}</p>
            <p>The picked driver is: {props.outputinothercomponent}</p>
        </div>
    )
}