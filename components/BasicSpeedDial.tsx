import * as React from 'react';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

interface Actions {
  icon: JSX.Element
  name: string
  onClick: React.MouseEventHandler<HTMLDivElement>
}


export default function BasicSpeedDial({actions}:{actions:Actions[]}) {
  return (
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: '15%', right: '5%' }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
  );
}