import './index.module.scss';
import 'diff2html/bundles/css/diff2html.min.css';

interface DiffProps {
  content: string;
}

const Diff: React.FC<DiffProps> = (props) => {
  return (
    <div className="diff" dangerouslySetInnerHTML={{ __html: props.content }} />
  );
};

export default Diff;
