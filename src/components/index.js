import HomeHeader from './Layout/Header/HomeHeader';
import Loader from './Layout/Loader';
// ElasticSearch
import LocationSearch from './ElasticSearch/LocationSearch';
import CardSearch from './ElasticSearch/CardSearch';
import FilterSearch from './ElasticSearch/FilterSearch/index.v2';
import ResultSearch from './ElasticSearch/ResultSearch';
import AreaFilter from './ElasticSearch/common/Area';
import DrawerFilter from './ElasticSearch/FilterSearch/DrawerFilter';
// Google Map
import GoogleMapForm from './SearchGoogleMap/GoogleMapForm';
import CheckPinGoogleMap from './SearchGoogleMap/CheckPinGoogleMap';
import ReviewLocation from './SearchGoogleMap/ReviewLocation';
import Autocomplete from './ElasticSearch/LocationSearch/index.v2';
// common
import Carousel from './common/Carousel';
import CustomTitle from './common/CustomTitle';
import ProcessBar from './common/ProcessBar';
import SavedList from './common/SavedList';
import RoomTypeCheckbox from './ElasticSearch/common/RoomTypeCheckbox';
import ReportForm from './Form/ReportForm';
// Form
import BuildingForm from './UploadRoom/BuildingForm';
import RoomInformation from './UploadRoom/RoomInformation';
import RoomInformationV2 from './UploadRoom/RoomInformation/index.v2';
import RoomServiceForm from './UploadRoom/RoomServiceForm';
import AmenitiesForm from './UploadRoom/AmenitiesForm';
import AmenitiesFormV2 from './UploadRoom/AmenitiesForm/index.v2';
import RoomPrice from './UploadRoom/RoomPrice';
import UploadForm from './UploadRoom/UploadForm';
import UploadFormV2 from './UploadRoom/UploadForm/index.v2';
import TermsAndPrivacy from './UploadRoom/TermsAndPrivacy';
import InputTypePrice from './UploadRoom/InputTypePrice';
// Management form
import RoomGroup from './ManagementRoom/RoomGroup'
import RoomRow from './ManagementRoom/RoomRow'
import RoomRowV2 from './ManagementRoom/RoomRow/index.v2'
import TableType from './ManagementRoom/TableType'
import TableTypeV2 from './ManagementRoom/TableType/index.v2'
// Big screen
import HomeScreen from './Home';

// Update form
import BuildingUpdateForm from './RoomUpdate/BuildingForm';
import RoomGroupUpdateForm from './RoomUpdate/RoomInformation';
import BuildingServices from './RoomUpdate/BuildingServices';
import RoomAmenities from './RoomUpdate/RoomAmenities';
import ImageUpdateForm from './RoomUpdate/UploadForm';
import RoomNameUpdate from './RoomUpdate/RoomName';

import CarouselForMessage from './Messages/CarouselForMessage';
// Review From Host
import ReviewFromHost from "./ReviewFromHost";
// Transaction
import Chatbox from './Chatbox';

export {
  Carousel,
  Loader,
  AreaFilter,
  DrawerFilter,
  HomeHeader,
  LocationSearch,
  CardSearch,
  FilterSearch,
  ResultSearch,
  GoogleMapForm,
  CheckPinGoogleMap,
  Autocomplete,
  CustomTitle,
  ProcessBar,
  RoomTypeCheckbox,
  BuildingForm,
  RoomServiceForm,
  AmenitiesForm,
  AmenitiesFormV2,
  UploadForm,
  UploadFormV2,
  RoomInformation,
  RoomInformationV2,
  RoomPrice,
  TermsAndPrivacy,
  InputTypePrice,
  RoomGroup,
  RoomRow,
  RoomRowV2,
  TableType,
  TableTypeV2,
  HomeScreen,
  BuildingUpdateForm,
  RoomGroupUpdateForm,
  BuildingServices,
  RoomAmenities,
  ImageUpdateForm,
  CarouselForMessage,
  Chatbox,
  ReviewLocation,
  SavedList,
  ReviewFromHost,
  RoomNameUpdate,
  ReportForm
};
