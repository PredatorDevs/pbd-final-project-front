// ADMIN
import brandIcon from '../img/icons/admin/brand.png';

const ImageProvider = ({
  fileRoute,
  width = '100px',
  addBackground = false,
  colorBackground = 'transparent'
}) => (
  <img
    alt="example"
    src={fileRoute}
    style={{
      width,
      marginRight: 5
    }}
  />
)

// ADMIN
export const GMenuBrandIcon = ({ width = '100px', addBackground = false, colorBackground = 'transparent' }) => (<ImageProvider fileRoute={brandIcon} width={width} addBackground={addBackground} colorBackground={colorBackground} />);
