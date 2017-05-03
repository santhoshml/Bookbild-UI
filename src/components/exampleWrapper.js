const React = require('react');
const classNames = require('classnames');
require('../../style/exampleWrapper.css');

const emptyAction = () => { };
const disableLink = (e) => e.stopPropagation();

const exampleWrapper = ({
  WrappedComponent,
  exampleName,
  examplePath,
  examplePlaygroundLink,
  exampleDescription }) => {
  const doesExamplePlayGroundLinkExist = examplePlaygroundLink === undefined ? false : true;
  const playgroundLinkClass = classNames({
    'disabled-link': !doesExamplePlayGroundLinkExist
  });

  const columns = [
    {
      key: 'id',
      name: 'ID',
      width: 80
    },
    {
      key: 'task',
      name: 'Title',
      filterable: true,
      sortable: true
    },
    {
      key: 'priority',
      name: 'Priority',
      filterable: true,
      sortable: true
    },
    {
      key: 'issueType',
      name: 'Issue Type',
      filterable: true,
      sortable: true
    },
    {
      key: 'complete',
      name: '% Complete',
      filterable: true,
      sortable: true
    },
    {
      key: 'startDate',
      name: 'Start Date',
      filterable: true,
      sortable: true
    },
    {
      key: 'completeDate',
      name: 'Expected Complete',
      filterable: true,
      sortable: true
    }
  ];

  const examplePlaygroundLinkAction = doesExamplePlayGroundLinkExist ? emptyAction : disableLink;

  const createRows = function(numberOfRows) {
    let rows = [];
    for (let i = 1; i < numberOfRows; i++) {
      rows.push({
        id: i,
        task: 'Task ' + i,
        complete: Math.min(100, Math.round(Math.random() * 110)),
        priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
        issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
        startDate: getRandomDate(new Date(2015, 3, 1), new Date()),
        completeDate: getRandomDate(new Date(), new Date(2016, 0, 1))
      });
    }
    return rows;
  };

  const getRandomDate=function(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  };


  return React.createClass({
    render() {
      return (
        <div>
          <div className="link-right">
            <a href={examplePath}>Jump to source</a> |
            <a href={examplePlaygroundLink} className={playgroundLinkClass} onClick={examplePlaygroundLinkAction}>Play around with it</a>
          </div>
          <h3>{ exampleName }</h3>
          <p>{ exampleDescription }</p>
          <WrappedComponent columns={columns} dataList={createRows(1000)}/>
        </div>
      );
    }
  });
};

module.exports = exampleWrapper;
