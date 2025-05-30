/*
 * eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) <2019>  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *      Further, all user interfaces, including but not limited to citizen facing interfaces,
 *         Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *         derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *      For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *      For any further queries on attribution, including queries on brand guidelines,
 *         please contact contact@egovernments.org
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.RoomHeight;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.springframework.stereotype.Service;

@Service
public class BathRoomWaterClosets extends FeatureProcess {

	private static final Logger LOG = LogManager.getLogger(BathRoomWaterClosets.class);
	private static final String RULE_41_IV = "41-iv";
	public static final String BathroomWaterClosets_DESCRIPTION = "Bathroom Water Closets";

	@Override
	public Plan validate(Plan pl) {

		return pl;
	}
//Method updated by Neha Sharma
	@Override
	public Plan process(Plan pl) {

		ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
		scrutinyDetail.setKey("Common_Bathroom Water Closets");
		scrutinyDetail.addColumnHeading(1, RULE_NO);
		scrutinyDetail.addColumnHeading(2, DESCRIPTION);
		scrutinyDetail.addColumnHeading(3, REQUIRED);
		scrutinyDetail.addColumnHeading(4, PROVIDED);
		scrutinyDetail.addColumnHeading(5, STATUS);

		Map<String, String> details = new HashMap<>();
		details.put(RULE_NO, RULE_41_IV);
		details.put(DESCRIPTION, BathroomWaterClosets_DESCRIPTION);

		BigDecimal minHeight = BigDecimal.ZERO, totalArea = BigDecimal.ZERO, minWidth = BigDecimal.ZERO;

		for (Block b : pl.getBlocks()) {
			if (b.getBuilding() != null && b.getBuilding().getFloors() != null
					&& !b.getBuilding().getFloors().isEmpty()) {

				for (Floor f : b.getBuilding().getFloors()) {

					if (f.getBathRoomWaterClosets() != null && f.getBathRoomWaterClosets().getHeights() != null
							&& !f.getBathRoomWaterClosets().getHeights().isEmpty()
							&& f.getBathRoomWaterClosets().getRooms() != null
							&& !f.getBathRoomWaterClosets().getRooms().isEmpty()) {

						if (f.getBathRoomWaterClosets().getHeights() != null
								&& !f.getBathRoomWaterClosets().getHeights().isEmpty()) {
							minHeight = f.getBathRoomWaterClosets().getHeights().get(0).getHeight();
							for (RoomHeight rh : f.getBathRoomWaterClosets().getHeights()) {
								if (rh.getHeight().compareTo(minHeight) < 0) {
									minHeight = rh.getHeight();
								}
							}
						}

						if (f.getBathRoomWaterClosets().getRooms() != null
								&& !f.getBathRoomWaterClosets().getRooms().isEmpty()) {
							minWidth = f.getBathRoomWaterClosets().getRooms().get(0).getWidth();
							for (Measurement m : f.getBathRoomWaterClosets().getRooms()) {
								totalArea = totalArea.add(m.getArea());
								if (m.getWidth().compareTo(minWidth) < 0) {
									minWidth = m.getWidth();
								}
							}
						}

						if (minHeight.compareTo(new BigDecimal(2.4)) >= 0
								&& totalArea.compareTo(new BigDecimal(1.1)) >= 0
								&& minWidth.compareTo(new BigDecimal(0.9)) >= 0) {

							details.put(REQUIRED, "Height >= 2.4, Total Area >= 1.1, Width >= 0.9");
							details.put(PROVIDED, "Height >= " + minHeight + ", Total Area >= " + totalArea
									+ ", Width >= " + minWidth);
							details.put(STATUS, Result.Accepted.getResultVal());
							scrutinyDetail.getDetail().add(details);
							pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);

						} else {
							details.put(REQUIRED, "Height >= 2.4, Total Area >= 2.8, Width >= 1.2");
							details.put(PROVIDED, "Height >= " + minHeight + ", Total Area >= " + totalArea
									+ ", Width >= " + minWidth);
							details.put(STATUS, Result.Not_Accepted.getResultVal());
							scrutinyDetail.getDetail().add(details);
							pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
						}

					}

				}
			}

		}

		return pl;
	}

	@Override
	public Map<String, Date> getAmendments() {
		return new LinkedHashMap<>();
	}

}
