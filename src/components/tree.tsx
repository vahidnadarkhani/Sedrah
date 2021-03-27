import { FC, useState } from 'react';
import SortableTree, {
  TreeItem,
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { GetNodeKeyFunction } from 'react-sortable-tree/utils/tree-data-utils';

import NodeRenderer from '@components/node-renderer';
import Button from '@material-ui/core/Button';
import { Checkbox, TextField } from '@material-ui/core';
import AlertDialog from '@components/dialog-box';

const Tree: FC = () => {
  const [treeData, setTreeData] = useState<Array<TreeItem>>([
    { id: 3, title: 'Peter Olofsson' },
    { id: 5, title: 'Karl Johansson' },
  ]);
  const [selectedNodes, setSelectedNodes] = useState<Array<TreeItem>>([]);
  const [isRemoveAlertVisible, setIsRemoveAlertVisible] = useState(false);
  const [
    selectedNodePathToRemove,
    setSelectedNodePathToRemove,
  ] = useState<Array<number | string> | null>(null);

  const nodeContentRenderer: typeof NodeRenderer = (nodeData) => {
    return NodeRenderer({ ...nodeData });
  };

  const getNodeKey: GetNodeKeyFunction = ({ treeIndex }) => treeIndex;

  const toggleRemoveAlert = () => {
    setIsRemoveAlertVisible((prevState) => !prevState);
  };

  const handleRemoveAlert = () => {
    if (selectedNodePathToRemove) {
      setTreeData((state) =>
        removeNodeAtPath({
          treeData: state,
          path: selectedNodePathToRemove,
          getNodeKey,
        }),
      );
      toggleRemoveAlert();
    }
  };

  const renderNodeButtons = (node: TreeItem, path: Array<string | number>) => {
    return [
      <Button
        key="add"
        variant="contained"
        color="primary"
        onClick={() =>
          setTreeData(
            (prevTreeData) =>
              addNodeUnderParent({
                treeData: prevTreeData,
                parentKey: path[path.length - 1],
                expandParent: true,
                getNodeKey,
                newNode: {
                  title: `ssssssssssss`,
                  id: (Math.random() * 100).toFixed(0),
                },
              }).treeData,
          )
        }
      >
        Add Child
      </Button>,
      <Button
        key="remove"
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedNodePathToRemove(path);
          setIsRemoveAlertVisible(true);
        }}
      >
        Remove
      </Button>,
      <Checkbox
        key="select checkbox"
        size="small"
        checked={selectedNodes.some(
          (selectedNode) => selectedNode.id === node.id,
        )}
        onChange={() => {
          setSelectedNodes((prevState) => {
            // TODO: fix this TS issue
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const newState = [...prevState];

            const wasSelectedNodeIndex = prevState.findIndex(
              (prevNode) => prevNode.id === node.id,
            );

            if (wasSelectedNodeIndex > -1) {
              newState.splice(wasSelectedNodeIndex, 1);
              return newState;
            } else {
              return [...prevState, node];
            }
          });
        }}
      />,
    ];
  };

  const renderNodeTitle = (node: TreeItem, path: Array<string | number>) => {
    return (
      <TextField
        variant="outlined"
        size="small"
        placeholder="node title"
        value={node?.title?.toString()}
        onChange={(event) => {
          const title = event.target.value;

          setTreeData((state) =>
            changeNodeAtPath({
              treeData: state,
              path,
              getNodeKey,
              newNode: { ...node, title },
            }),
          );
        }}
      />
    );
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        disabled={selectedNodes.length === 0}
        onClick={() => alert(JSON.stringify(selectedNodes))}
      >
        alert selected
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => alert(JSON.stringify(treeData))}
      >
        Save
      </Button>
      <div style={{ height: 500 }}>
        <SortableTree
          rowDirection="rtl"
          treeData={treeData}
          nodeContentRenderer={nodeContentRenderer}
          generateNodeProps={({ node, path }) => ({
            buttons: renderNodeButtons(node, path),
            title: renderNodeTitle(node, path),
          })}
          onChange={(treeData) => setTreeData(treeData)}
        />
      </div>
      <AlertDialog
        open={isRemoveAlertVisible}
        title="Remove Nodes"
        content="Are you sure to remove the nodes?"
        okText="Yes"
        cancelText="No"
        onOK={handleRemoveAlert}
        onCancel={toggleRemoveAlert}
      />
    </>
  );
};

export default Tree;
