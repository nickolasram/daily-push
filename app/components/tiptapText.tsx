import parse from 'html-react-parser';
const TipTapText = ({text}:{text:string}) =>{
    return (
        <div>
            {parse(text)}
        </div>
    )
}

export default TipTapText;