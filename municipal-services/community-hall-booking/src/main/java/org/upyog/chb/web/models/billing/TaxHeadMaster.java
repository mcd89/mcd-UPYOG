package org.upyog.chb.web.models.billing;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.upyog.chb.web.models.AuditDetails;
import org.upyog.chb.web.models.GlCodeMaster;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a Tax Head Master entity in the Community Hall Booking module.
 * 
 * Purpose:
 * - To define the structure for tax head master data.
 * - To associate tax heads with services and categories.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaxHeadMaster {

	private String id;

	@NotNull
	private String tenantId;
	@Valid
	@NotNull
	private TaxHeadCategory category;
	@NotNull
	private String service;
	@NotNull
	private String name;

	private String code;
	
	private List<GlCodeMaster> glCodes;

	private Boolean isDebit = false;

	private Boolean isActualDemand;
	@NotNull
	private Long validFrom;
	@NotNull
	private Long validTill;
	
	private Integer order;

	private AuditDetails auditDetail;
	

}
