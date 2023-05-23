import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import HistoryIcon from '@mui/icons-material/History';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ReceiptIcon from '@mui/icons-material/Receipt';

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
        link: "/analysis"
    },
    {
        id: 3,
        icon: <SummarizeIcon />,
        text: "Reporting",
        link: "/reports"
    },
    {
        id: 4,
        icon: <ReceiptIcon />,
        text: "Invoices",
        link: "/invoices"
    },
    {
        id: 5,
        icon: <FileUploadIcon />,
        text: "Import",
        link: "/upload"
    },
    {
        id: 6,
        icon: <SettingsIcon />,
        text: "Settings",
        link: "/settings"
    }
    
]