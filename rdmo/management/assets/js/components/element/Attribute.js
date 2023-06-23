import React from 'react'
import PropTypes from 'prop-types'

import { filterElement } from '../../utils/filter'
import { buildPath } from '../../utils/location'

import { ElementErrors } from '../common/Errors'
import { EditLink, CopyLink, AddLink, LockedLink, NestedLink, ExportLink, CodeLink } from '../common/Links'

const Attribute = ({ config, attribute, elementActions, display='list', filter=null, indent=0 }) => {

  const showElement = filterElement(filter, attribute)

  const editUrl = buildPath(config.baseUrl, 'attributes', attribute.id)
  const copyUrl = buildPath(config.baseUrl, 'attributes', attribute.id, 'copy')
  const nestedUrl = buildPath(config.baseUrl, 'attributes', attribute.id, 'nested')
  const exportUrl = buildPath('/api/v1/', 'domain', 'attributes', attribute.id, 'export')

  const fetchEdit = () => elementActions.fetchElement('attributes', attribute.id)
  const fetchCopy = () => elementActions.fetchElement('attributes', attribute.id, 'copy')
  const fetchNested = () => elementActions.fetchElement('attributes', attribute.id, 'nested')
  const toggleLocked = () => elementActions.storeElement('attributes', {...attribute, locked: !attribute.locked })

  const createAttribute = () => elementActions.createElement('attributes', { attribute })

  const elementNode = (
    <div className="element">
      <div className="pull-right">
        {
          !attribute.is_leaf_node &&
          <NestedLink title={gettext('View attribute nested')} href={nestedUrl} onClick={fetchNested} />
        }
        <EditLink title={gettext('Edit attribute')} href={editUrl} onClick={fetchEdit} />
        <CopyLink title={gettext('Copy attribute')} href={copyUrl} onClick={fetchCopy} />
        <AddLink title={gettext('Add attribute')} onClick={createAttribute} />
        <LockedLink title={attribute.locked ? gettext('Unlock attribute') : gettext('Lock attribute')}
                    locked={attribute.locked} onClick={toggleLocked} />
        <ExportLink title={gettext('Export attribute')} exportUrl={exportUrl}
                    exportFormats={config.settings.export_formats} csv={true} />
      </div>
      <div>
        <p>
          <strong>{gettext('Attribute')}{': '}</strong>
          <CodeLink className="code-domain" uri={attribute.uri} onClick={() => fetchEdit()} />
        </p>
        <ElementErrors element={attribute} />
      </div>
    </div>
  )

  switch (display) {
    case 'list':
      return showElement && (
        <li className="list-group-item">
          { elementNode }
        </li>
      )
    case 'nested':
      return (
        <>
          {
            showElement && <div className="panel panel-default" style={{ marginLeft: 30 * indent }}>
              <div className="panel-body">
                { elementNode }
              </div>
            </div>
          }
          {
            attribute.elements.map((attribute, index) => (
              <Attribute key={index} config={config} attribute={attribute} elementActions={elementActions}
                         display="nested" filter={filter} indent={indent + 1} />
            ))
          }
        </>
      )
    case 'plain':
      return elementNode
  }
}

Attribute.propTypes = {
  config: PropTypes.object.isRequired,
  attribute: PropTypes.object.isRequired,
  elementActions: PropTypes.object.isRequired,
  display: PropTypes.string,
  filter: PropTypes.object,
  indent: PropTypes.number
}

export default Attribute
