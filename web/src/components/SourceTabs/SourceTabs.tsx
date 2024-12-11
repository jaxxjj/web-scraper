import { Box, Tabs, Tab } from '@mui/material'

interface SourceTabsProps {
  sources: string[]
  currentSource: string
  onSourceChange: (source: string) => void
}

const SourceTabs = ({
  sources,
  currentSource,
  onSourceChange,
}: SourceTabsProps) => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
        mb: 4,
      }}
    >
      <Tabs
        value={sources.indexOf(currentSource)}
        onChange={(_, index) => onSourceChange(sources[index])}
        variant="fullWidth"
        sx={{
          '& .MuiTab-root': {
            fontSize: '1.1rem',
            py: 2,
          },
        }}
      >
        {sources.map((source) => (
          <Tab
            key={source}
            label={source.toUpperCase()}
            value={sources.indexOf(source)}
          />
        ))}
      </Tabs>
    </Box>
  )
}

export default SourceTabs
