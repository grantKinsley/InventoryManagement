import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import HistoryIcon from '@mui/icons-material/History';

export const navData = [
    {
        id: 0,
        icon: <HomeIcon />,
        text: "Dashboard",
        link: "/"
    },
    {
        id: 1,
        icon: <TravelExploreIcon />,
        text: "Catalog",
        link: "/catalog"
    },
    {
        id: 2,
        icon: <BarChartIcon />,
        text: "Analysis",
        link: "/data"
    },
    {
        id: 3,
        icon: <HistoryIcon />,
        text: "History",
        link: "/history"
    },
    {
        id: 4,
        icon: <FileUploadIcon />,
        text: "Upload",
        link: "/upload"
    },
    {
        id: 5,
        icon: <SettingsIcon />,
        text: "Settings",
        link: "/settings"
    }
    
]