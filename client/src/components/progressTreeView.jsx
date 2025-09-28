import React from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

// --- Import MUI Icons & Components ---
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LockIcon from '@mui/icons-material/Lock';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/Edit'; // Icon for override button
import { Box, Typography, Chip, Button, IconButton, Menu, MenuItem } from '@mui/material';

const getStatusChip = (status) => {
  switch (status) {
    case 'Completed': return <Chip icon={<CheckCircleIcon />} label="Completed" color="success" variant="outlined" size="small" />;
    case 'In Progress': return <Chip icon={<SyncIcon />} label="In Progress" color="info" variant="outlined" size="small" />;
    default: return <Chip icon={<LockIcon />} label="Locked" color="default" variant="outlined" size="small" />;
  }
};

const OverrideMenu = ({ node, onUpdateStatus }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSelectStatus = (status) => {
        onUpdateStatus(node._id, status);
        handleClose();
    }

    return (
        <Box>
            <IconButton
                aria-label="override status"
                size="small"
                onClick={handleClick}
                sx={{ ml: 2 }}
            >
                <EditIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => handleSelectStatus('Locked')}>Set to Locked</MenuItem>
                <MenuItem onClick={() => handleSelectStatus('In Progress')}>Set to In Progress</MenuItem>
                <MenuItem onClick={() => handleSelectStatus('Completed')}>Set to Completed</MenuItem>
            </Menu>
        </Box>
    );
};

const RenderTree = ({ node, onUpdateStatus, isFacultyView }) => {
  const isStudentActionable = !isFacultyView && ['Task', 'Subtask'].includes(node.itemType) && node.status !== 'Completed';

  return (
    <TreeItem
      key={node._id}
      itemId={node._id}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          <Typography variant="body1" sx={{ flexGrow: 1, mr: 2 }}>
            {node.name}
          </Typography>
          {getStatusChip(node.status)}
          
          { }
          {isStudentActionable && (
             <Button
                variant="outlined" size="small" startIcon={<RadioButtonUncheckedIcon />}
                sx={{ ml: 2, textTransform: 'none' }}
                onClick={(e) => { e.stopPropagation(); onUpdateStatus(node._id, 'Completed'); }}
             >
                Mark as Complete
             </Button>
          )}

          {isFacultyView && <OverrideMenu node={node} onUpdateStatus={onUpdateStatus} />}
        </Box>
      }
    >
      {Array.isArray(node.children)
        ? node.children.map((childNode) => <RenderTree key={childNode._id} node={childNode} onUpdateStatus={onUpdateStatus} isFacultyView={isFacultyView} />)
        : null}
    </TreeItem>
  );
};


const ProgressTreeView = ({ nodes, onUpdateStatus, isFacultyView = false }) => {
  const defaultExpanded = nodes.length > 0 ? [nodes[0]._id] : [];
  return (
    <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: '100%' }}>
      <SimpleTreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultExpandedItems={defaultExpanded}
      >
        {nodes.map((node) => (
          <RenderTree key={node._id} node={node} onUpdateStatus={onUpdateStatus} isFacultyView={isFacultyView} />
        ))}
      </SimpleTreeView>
    </Box>
  );
};

export default ProgressTreeView;
